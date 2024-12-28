import { Express, NextFunction, RequestHandler } from "express";
import { HookContext } from "@feathersjs/feathers";
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
      user: User;
      authenticated: boolean;
    }
  }
}

export const createAuth = (app: Express) => {
  // The middleware inspects the session data for requests to check to see if this
  // property has been set. If it has, then the username and authenticated properties
  // of the Request object are set, which is how the rest of the application will be
  // able to identify the authenticated user.
  app.use((req, res, next) => {
    // When the user’s credentials are validated, the username property added
    // to the SessionData interface is used to store the username.
    const username = req.session.username;
    if (username) {
      req.authenticated = true;
      req.user = { username };
    } else if (req.headers.authorization) {
      let token = req.headers.authorization;
      if (token.startsWith("Bearer ")) {
        token = token.substring(7);
      }
      try {
        const decoded = jwt.verify(token, jwt_secret) as User;
        req.authenticated = true;
        req.user = { username: decoded.username };
      } catch {
        // do nothing - cannot verify token
        console.log("Token ERROR");
      }
    } else {
      req.authenticated = false;
    }
    // Local data values named user and authenticated. This information will be available to any
    // template that is executed by a request/response that has been processed by this middleware.
    res.locals.user = req.user;
    res.locals.authenticated = req.authenticated;
    next();
  });
  app.get("/signin", (req, res) => {
    const data = {
      username: req.query["username"],
      password: req.query["password"],
      failed: req.query["failed"] ? true : false,
      // signingpage is passed to the render method when the sign-in form is presented to the user.
      signinpage: true,
    };
    res.render("signin", data);
  });
  app.post("/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const valid = await store.validateCredentials(username, password);
    if (valid) {
      req.session.username = username;
      res.redirect("/");
    } else {
      res.redirect(
        // Pattern Post/Redirect/Get
        `/signin?username=${username}&password=${password}&failed=1`
      );
    }
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
      const username = req.user.username;
      if (await store.validateMembership(username, role)) {
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
