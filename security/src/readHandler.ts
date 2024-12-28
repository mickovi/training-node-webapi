import { Request, Response } from "express";

export const readHandler = (req: Request, res: Response) => {
  /* res.json({
    message: "Hello, World"
  }); */
  res.cookie("sessionID", "mysecretcode");
  req.pipe(res);
}