import { IncomingMessage, ServerResponse } from "http";

export const readHandler = async (req: IncomingMessage, res: ServerResponse) => {
  req.setEncoding("utf-8");
  for await (const data of req) {
    console.log(data);
  }
  console.log("End: all data read");
  res.end();  
};