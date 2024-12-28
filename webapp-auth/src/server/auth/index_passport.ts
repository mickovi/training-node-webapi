import { Express, NextFunction, RequestHandler } from "express";
import { HookContext } from "@feathersjs/feathers";
import passport from "passport";
import { configurePassport } from "./passport_config";
import { AuthStore } from "./auth_types";
import { OrmAuthStore } from "./orm_authstore";
import jwt from "jsonwebtoken";
const jwt_secret = "mytokensecret";

const store: AuthStore = new OrmAuthStore();
type User = { username: string };

// This declare extends the SessionData interface to define a username
// property so that a user’s identity can be associated with a session.
declare module "express-session" {
  interface SessionData {
    username: string;
  }
}
// This declare statement adds user and authenticated properties to the
// Express Request interface, which will allow more complex user data to
// be provided to the rest of the application.
declare global {
  namespace Express {
    interface Request {
      uthenticated: boolean;
    }
    interface User {
      username: string;
    }
  }
}

export const createAuth = (app: Express) => {
  app.get("/signin", (req, res) => {
    const data = {
      failed: req.query["failed"] ? true : false,
      // signingpage is passed to the render method when the sign-in form is presented to the user.
      signinpage: true,
    };
    res.render("signin", data);
  });
  app.post(
    "/signin",
    passport.authenticate("local", {
      failureRedirect: `/signin?failed=1`,
      successRedirect: "/",
    })
  );
  app.use(passport.authenticate("session"), (req, resp, next) => {
    resp.locals.user = req.user;
    resp.locals.authenticated = req.authenticated = req.user !== undefined;
    next();
  });
  app.post("/api/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const result: any = {
      success: await store.validateCredentials(username, password),
    };
    if (result.success) {
      result.token = jwt.sign({ username }, jwt_secret, { expiresIn: "1hr" });
    }
    res.json(result);
    res.end();
  });
  app.post("/signout", async (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
  app.get("/unauthorized", async (req, res) => {
    res.render("unauthorized");
  });
};

// The roleGuard function accepts a role and returns a middleware component that will only
// pass on the request to the handler if the user has been assigned to that role, which is
// checked using the validateMembership method provided by the store.
export const roleGuard = (
  role: string
): RequestHandler<Request, Response, NextFunction> => {
  return async (req, res, next) => {
    if (req.authenticated) {
      const username = req.user?.username;
      if (username != undefined && await store.validateMembership(username, role)) {
        next();
        return;
      }
      res.redirect("/unauthorized");
    } else {
      res.redirect("/signin");
    }
  };
};

export const roleHook = (role: string) => {
  return async (ctx: HookContext) => {
    if (!ctx.params.authenticated) {
      ctx.http = { status: 401 };
      ctx.result = {};
    } else if (
      !(await store.validateMembership(ctx.params.user.username, role))
    ) {
      ctx.http = { status: 403 };
      ctx.result = {};
    }
  };
};
