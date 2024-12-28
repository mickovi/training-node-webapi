import express, { Express } from "express";
import cookieMiddleware from "cookie-parser";
import { getCookie, getJsonCookie, setJsonCookie } from "./cookies";
import repository from "./data";

const rowLimit = 10;
export const registerFormMiddleware = (app: Express) => {
  app.use(express.urlencoded({ extended: true }));
  // This middleware populates the Request object’s cookies property for 
  // regular cookies and the signedCookies property for signed cookies.
  app.use(cookieMiddleware("mysecret"));
};
export const registerFormRoutes = (app: Express) => {
  app.get("/form", async (req, res) => {
    res.render("age", {
      history: await repository.getAllResults(rowLimit),
      personalHistory: getJsonCookie(req, "personalHistory"),
    });
  });
  // Each new POST request creates a new Set-Cookie header in the response, 
  // with a new five-minute expiry time.
  app.post("/form", async (req, res) => {
    const nextage =
      Number.parseInt(req.body.age) + Number.parseInt(req.body.years);
    await repository.saveResult({ ...req.body, nextage });
    // A cookie is used to store the last five results created for the user.
    let pHistory = [
      {
        name: req.body.name,
        age: req.body.age,
        years: req.body.years,
        nextage,
      },
      ...(getCookie(req, "personalHistory") || []),
    ].splice(0, 5);

    setJsonCookie(res, "personalHistory", pHistory);

    const context = {
      ...req.body,
      nextage,
      history: await repository.getResultsByName(req.body.name, rowLimit),
      personalHistory: pHistory,
    };
    res.render("age", context);
  });
};
