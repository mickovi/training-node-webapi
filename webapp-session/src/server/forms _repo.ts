import express, { Express } from "express";
import cookieMiddleware from "cookie-parser";
import { customSessionMiddleware } from "./sessions/middleware";
import { getSession } from "./sessions/session_helpers";
import repository from "./data";

const rowLimit = 10;
export const registerFormMiddleware = (app: Express) => {
  app.use(express.urlencoded({ extended: true }));
  // Express and the cookie middleware take responsibility for creating the 
  // Set-Cookie header in responses and parsing Cookie headers in requests.
  app.use(cookieMiddleware("mysecret"));
  app.use(customSessionMiddleware());
};
// - Storing session data in memory.
// - Session data can be stored as a set of key/value pairs, 
// which makes it easy to use JavaScript objects to represent data.
export const registerFormRoutes = (app: Express) => {
  app.get("/form", async (req, res) => {
    res.render("age", {
      history: await repository.getAllResults(rowLimit),
      personalHistory: getSession(req).data.personalHistory,
    });
  });
  // Each new POST request creates a new Set-Cookie header in the response, 
  // with a new five-minute expiry time.
  app.post("/form", async (req, res) => {
    const nextage =
      Number.parseInt(req.body.age) + Number.parseInt(req.body.years);
    await repository.saveResult({ ...req.body, nextage });
    // A cookie is used to store the last five results created for the user.
    req.session.data.personalHistory = [
      {
        name: req.body.name,
        age: req.body.age,
        years: req.body.years,
        nextage,
      },
      ...(req.session.data.personalHistory || []),
    ].splice(0, 5);

    const context = {
      ...req.body,
      nextage,
      history: await repository.getResultsByName(req.body.name, rowLimit),
      personalHistory: req.session.data.personalHistory,
    };
    res.render("age", context);
  });
};
