import express, { Express } from "express";
import repository from "./data";
import cookieMiddleware from "cookie-parser";
import { sessionMiddleware } from "./sessions/session_helpers";
import { Result } from "./data/repository";
import { roleGuard } from "./auth";

const rowLimit = 10;

export const registerFormMiddleware = (app: Express) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieMiddleware("mysecret"));
  app.use(sessionMiddleware());
};
export const registerFormRoutes = (app: Express) => {
  app.get("/form", async (req, res) => {
    res.render("data", { data: await repository.getAllResults(rowLimit) });
  });
  app.post("/form/delete/:id", roleGuard("Admins"), async (req, res) => {
    const id = Number.parseInt(req.params["id"]);
    await repository.delete(id);
    res.redirect("/form");
    res.end();
  });  
  app.post("/form/add", roleGuard("Users"), async (req, resp) => {
    const nextage =
      Number.parseInt(req.body["age"]) + Number.parseInt(req.body["years"]);
    await repository.saveResult({ ...req.body, nextage } as Result);
    resp.redirect("/form");``
    resp.end();
  });
};
