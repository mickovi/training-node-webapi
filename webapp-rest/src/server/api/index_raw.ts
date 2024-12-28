import { Express } from "express";
import repository from "../data";

export const createApi = (app: Express) => {
  app.get("/api/results", async (req, res) => {
    if (req.query.name) {
      const data = await repository.getResultsByName(
        req.query.name.toString(),
        10
      );
      if (data.length > 0) res.json(data);
      else res.writeHead(404);
    } else {
      res.json(await repository.getAllResults(10));
    }
    res.end();
  });
  app.all("/api/results/:id", async (req, res) => {
    const id = Number.parseInt(req.params.id);
    if (req.method == "GET") {
      const result = await repository.getResultById(id);
      if (result == undefined) {
        res.writeHead(404);
      } else {
        res.json(result);
      }
    } else if (req.method == "DELETE") {
      let deleted = await repository.delete(id);
      res.json({ deleted });
    }
    res.end();
  });
  app.post("/api/results", async (req, res) => {
    const { name, age, years } = req.body;
    const nextage = Number.parseInt(age) + Number.parseInt(years);
    const id = await repository.saveResult({
      id: 0,
      name,
      age,
      years,
      nextage,
    });
    res.json(await repository.getResultById(id));
    res.end();
  });
};
