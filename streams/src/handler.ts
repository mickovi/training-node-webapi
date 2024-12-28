import { IncomingMessage, ServerResponse } from "http";

export const basicHandler = (req: IncomingMessage, res: ServerResponse) => {
  res.setHeader("Content-Type", "text/plain");
  let i = 0;
  let canWrite = true;
  const writeData = () => {
    console.log("Started writing data");
    do {
      canWrite = res.write(`Message: ${i++}\n`);
    } while(i < 10_000 && canWrite);
    console.log("Stream buffer is at capacity");
    if (i < 10_000) {
      res.once("drain", () => {
        console.log("Buffer has been drained");
        writeData();
      });
    } else {
      res.end("End");
    }
  }
  writeData();
};