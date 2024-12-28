import { Request, Response } from "express";

export const readHandler = (req: Request, res: Response) => {
  res.cookie("sessionID", "mysecretcode");
  req.pipe(res);
}