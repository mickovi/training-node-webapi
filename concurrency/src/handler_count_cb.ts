import { IncomingMessage, ServerResponse } from "http";
import { endPromise, writePromise } from "./promises";
import { Count } from "./count_cb";

const total = 2_000_000_000;
const iterations = 5;
let shared_counter = 0;

export const handler = async (req: IncomingMessage, res: ServerResponse) => {
  const request = shared_counter++;
  Count(request, iterations, total, async (err, update) => {
    if (err !== null) {
      console.log(err);
        res.statusCode = 500;
        await res.end();
    } else if (update !== true) {
      const msg = `Request: ${request}, Iteration: ${(update)}`;
      console.log(msg);
      await writePromise.bind(res)(msg + "\n");
    } else {
      await endPromise.bind(res)("Done");
    }
  })  
};
