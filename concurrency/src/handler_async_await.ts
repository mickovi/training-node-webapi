import { IncomingMessage, ServerResponse } from "http";
import { readFile } from "fs/promises";

/* Using the async and await keywords flattens the code by removing 
the need for the then method and its function. */

export const handler = async (req: IncomingMessage, res: ServerResponse) => {
  // try-catch replaces the catch keyword on promises
  try {
    const data: Buffer = await readFile("data.json"); // a promise
  
    res.end(data, () => console.log("File sent")); // a callback
  } catch (err: any) {
    console.log(`Error: ${err?.message ?? err}`);
    res.statusCode = 500;
    res.end();
  }
  /* OBS: The promise and callback APIs can be mixed without problems, but the result can be awkward code. */
}