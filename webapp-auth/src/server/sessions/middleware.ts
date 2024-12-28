/* 
  This middleware component reads a cookie that contains a session ID and uses it 
  to get the session from the repository and associate it with the Request object 
  by adding a property named session. If there is no cookie, or no session can be 
  found with the ID, then a new session is started.
*/

import { Request, Response, NextFunction } from "express";
import { SessionRepository, Session } from "./repository";
// import { MemoryRepository } from "./memory_repository";
import { OrmRepository } from "./orm_repository";
import { setCookie, getCookie } from "../cookies";

const session_cookie_name = "custom_session";
const expiry_seconds = 300;
const getExpiryDate = () => new Date(Date.now() + expiry_seconds * 1_000);

export const customSessionMiddleware = () => {
  // const repo: SessionRepository = new MemoryRepository();
  const repo: SessionRepository = new OrmRepository();
  return async (req: Request, res: Response, next: NextFunction) => {
    const id = getCookie(req, session_cookie_name);
    const session =
      (id ? await repo.getSession(id) : undefined) ??
      (await repo.createSession());

    (req as any).session = session;
    setCookie(res, session_cookie_name, session.id, {
      maxAge: expiry_seconds * 1000,
    });
    res.once("finish", async () => {
      if (Object.keys(session.data).length > 0) {
        if (req.method == "POST") {
          await repo.saveSession(session, getExpiryDate());
        } else {
          // The touchSession method is used to extend the session expiry 
          // time but the session data isn’t stored.
          await repo.touchSession(session, getExpiryDate());
        }
      }
    });
    next();
  };
};
