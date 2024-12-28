import express, { Express } from "express";
import repository from "./data";

const rowLimit = 10;
export const registerFormMiddleware = (app: Express) => {
  app.use(express.urlencoded({ extended: true }));
};
export const registerFormRoutes = (app: Express) => {
  app.get("/form", async (_, res) => {
    res.render("age", {
      history: await repository.getAllResults(rowLimit),
    });
  });
  app.post("/form", async (req, res) => {
    const nextage =
      Number.parseInt(req.body.age) + Number.parseInt(req.body.years);
    await repository.saveResult({ ...req.body, nextage });
    const context = {
      ...req.body,
      nextage,
      history: await repository.getResultsByName(req.body.name, rowLimit),
    };
    res.render("age", context);
  });
};
