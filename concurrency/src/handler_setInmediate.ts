import { IncomingMessage, ServerResponse } from "http";
import { endPromise, writePromise } from "./promises";

const total = 2_000_000_000;
const iterations = 5;
let shared_counter = 0;

export const handler = async (req: IncomingMessage, res: ServerResponse) => {
  const request = shared_counter++;

  const iterate = async (iter: number = 0) => {
    for (let count = 0; count < total; count++) {
      count++;
    }
    
    const msg = `Request: ${request}, Iteration: ${(iter)}`;
    console.log(msg);
    await writePromise.bind(res)(msg + "\n");
    
    if (iter == iterations - 1)
      await endPromise.bind(res)("Done");
    else
      setImmediate(() => iterate(++iter));
  }
  iterate();
};
