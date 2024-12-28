import { IncomingMessage, ServerResponse } from "http";

export const readHandler = (req: IncomingMessage, res: ServerResponse) => {
  req.setEncoding("utf-8");
  req.on("data", (data: string) => {
    console.log(data);
  });
  req.on("end", () => {
    console.log("End: all data read");
    res.end();
  });
};