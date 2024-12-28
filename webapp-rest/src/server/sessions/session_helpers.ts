/* 
  - The middleware component adds a session property to requests, 
  but this isn’t a part of the standard Express Request type and 
  isn’t known by the TypeScript compiler.
  - There are two good ways to solve this problem: a helper function 
  that reads the session property or a new type that extends the one 
  provided by Express.
*/

import { Request } from "express";
// import { Session } from "./repository";
import session, { SessionData } from "express-session";
import sessionStore from "connect-session-sequelize";
import { Sequelize } from "sequelize";
import { Result } from "../data/repository";

//The getSession function receives a Request object and returns the session property 
// by using as any to work around the TypeScript type checks. 
export const getSession = (req: Request): SessionData => (req as any).session;
// The declare keyword is used to tell TypeScript that the Request interface 
// has an additional property.
/* declare global {
  namespace Express {
    interface Request {
      session: Session;
    }
  }
} */

declare module "express-session" {
  interface SessionData {
    personalHistory: Result[];
  }
}

export const sessionMiddleware = () => {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "pkg_sessions.db",
  });
  const store = new (sessionStore(session.Store))({
    db: sequelize,
  });
  store.sync();
  return session({
    secret: "mysecret",
    store: store,
    cookie: { maxAge: 300 * 1000, sameSite: "strict" },
    resave: false,
    saveUninitialized: false,
  });
};
