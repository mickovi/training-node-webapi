import { IncomingMessage, ServerResponse } from "http";
import { Request, Response } from "express";

export const readHandler = async (req: Request, res: Response) => {
  if (req.headers["content-type"] == "application/json") {
    const payload = req.body;
    if (payload instanceof Array) {
      res.json({arraySize: payload.length});
    } else {
      res.write("Did not receive an array");
    }
    res.end();
  } else {
    req.pipe(res);
  }
};