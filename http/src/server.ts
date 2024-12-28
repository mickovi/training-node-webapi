import { createServer } from "http";
import { createServer as createHttpsServer } from "https";
import { readFileSync } from "fs";
import { handler, redirectionHandler } from "./handler_redirecting_http";

const port = 5000;
const https_port = 5500;
const server = createServer(redirectionHandler);

server.listen(port, () => {
  console.log(`(Event) Server listening on port ${port}`);
});

const httpsConfig = {
  key: readFileSync("key.pem"),
  cert: readFileSync("cert.pem"),
};

const httpsServer = createHttpsServer(httpsConfig, handler);
httpsServer.listen(https_port, () =>
  console.log(`HTTPS Server listening on port ${https_port}`)
);
