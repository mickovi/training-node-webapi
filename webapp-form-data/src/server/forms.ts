import express, { Express } from "express";
import multer from "multer";
import { santizeValue } from "./sanitize";

const fileMiddleware = multer({ storage: multer.memoryStorage() });

export const registerFormMiddleware = (app: Express) => {
  app.use(express.urlencoded({ extended: true }));
};
export const registerFormRoutes = (app: Express) => {
  app.get("/form", (req, res) => {
    for (const key in req.query) {
      res.write(`${key}: ${req.query[key]}\n`);
    }
    res.end();
  });

  // Node.js and Express read the headers from the HTTP request
  // and leave the body so that it can be read as a stream.
  /* app.post("/form", (req, res) => {
        res.write(`Content-Type: ${req.headers["content-type"]}\n`);
        if (req.headers["content-type"]?.startsWith("multipart/form-data")) {
            req.pipe(res);
        } else {
            for (const key in req.body) {
                res.write(`${key}: ${req.body[key]}\n`);           
            }
            res.end();
        }
    }) */
  /* app.post("/form", fileMiddleware.single("datafile"), (req, res) => {
    res.setHeader("Content-Type", "text/html");
    for (const key in req.body) {
      res.write(`<div>${key}: ${santizeValue(req.body[key])}</div>`);
    }
    if (req.file) {
        res.write(`<div>File: ${req.file.originalname}</div>`);
        res.write(`<div>${santizeValue(req.file.buffer.toString())}</div>`);           
    }
    res.end();
  }); */

  // No entiendo el error aqui
  app.post("/form", fileMiddleware.single("datafile"), (req, res) => {
    console.log(req.file?.buffer.toString())
    res.render("formData", {
        ...req.body, file: req.file,
        fileData: req.file?.buffer.toString()
      });
    }
  );
}
