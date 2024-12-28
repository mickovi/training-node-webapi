import { IncomingMessage, ServerResponse } from "http";
import { readFile } from "fs";

/* One advantage of callbacks over promises is that callbacks can be invoked 
more than once for the same operation, allowing a series of updates to be 
provided while asynchronous work is being performed. Promises are intended 
to produce a single result without any interim updates. */

export const handler = (req: IncomingMessage, res: ServerResponse) => {
  readFile("data.json", (err: Error | null, data: Buffer) => {
    if (err == null) {
      res.end(data, () => console.log("File sent"));
    } else {
      console.log(`Error: ${err.message}`);
      res.statusCode = 500;
      res.end();
    }
  });
}