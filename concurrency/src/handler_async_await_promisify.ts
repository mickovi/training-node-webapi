import { IncomingMessage, ServerResponse } from "http";
import { readFile } from "fs/promises";
import { endPromise } from "./promises";

export const handler = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const data: Buffer = await readFile("data.json"); // a promise
  
    await endPromise.bind(res)(
      data
    ); // a promise
    console.log("File sent");
  } catch (err: any) {
    console.log(`Error: ${err?.message ?? err}`);
    res.statusCode = 500;
    res.end();
  }
  /* OBS: The promise and callback APIs can be mixed without problems, but the result can be awkward code. */
}