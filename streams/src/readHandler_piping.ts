import { IncomingMessage, ServerResponse } from "http";

export const readHandler = async (req: IncomingMessage, res: ServerResponse) => {
  req.pipe(res);
};