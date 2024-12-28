import express, { Express } from "express";
import cookieMiddleware from "cookie-parser";
import { getSession, sessionMiddleware } from "./sessions/session_helpers";
import repository from "./data"; // use index.ts

const rowLimit = 10;
export const registerFormMiddleware = (app: Express) => {
  app.use(express.urlencoded({ extended: true }));
  // Express and the cookie middleware take responsibility for creating the 
  // Set-Cookie header in responses and parsing Cookie headers in requests.
  app.use(cookieMiddleware("mysecret"));
  app.use(sessionMiddleware());
};
export const registerFormRoutes = (app: Express) => {
  app.get("/form", async (req, res) => {
    res.render("age", {
      history: await repository.getAllResults(rowLimit),
      personalHistory: getSession(req).personalHistory,
    });
  });
  // Each new POST request creates a new Set-Cookie header in the response, 
  // with a new five-minute expiry time.
  app.post("/form", async (req, res) => {
    const nextage =
      Number.parseInt(req.body.age) + Number.parseInt(req.body.years);
    await repository.saveResult({ ...req.body, nextage });
    // A cookie is used to store the last five results created for the user.
    req.session.personalHistory = [
      {
        id: 0,
        name: req.body.name,
        age: req.body.age,
        years: req.body.years,
        nextage,
      },
      ...(req.session.personalHistory || []),
    ].splice(0, 5);

    const context = {
      ...req.body,
      nextage,
      history: await repository.getResultsByName(req.body.name, rowLimit),
      personalHistory: req.session.personalHistory,
    };
    res.render("age", context);
  });
};
