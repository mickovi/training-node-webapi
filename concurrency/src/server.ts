import { createServer } from "http";
import { handler } from "./handler_count_promise";

const port = 5000;
const server = createServer(handler);

server.listen(port, function() {
  console.log(`Server listening on port ${port}`);
});