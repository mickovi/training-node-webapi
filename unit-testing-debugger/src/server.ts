import { createServer } from "http";
import express, { Express } from "express";
import { readHandler } from "./readHandler";
import cors from "cors";
import httpProxy from "http-proxy";
import helmet from "helmet";

const port = 5000;
const expressApp: Express = express();
const proxy = httpProxy.createProxyServer({
  target: "http://localhost:5100", ws: true
});
expressApp.use(helmet({
  contentSecurityPolicy: {
      directives: {
          imgSrc: "'self'",
          scriptSrcAttr: "'none'",
          scriptSrc: "'self'",
          connectSrc: "'self' ws://localhost:5000"           
      }
  }
}));
expressApp.use(cors({
  origin: "http://localhost:5100"
}));
expressApp.use(express.json());

expressApp.post("/read", readHandler);
expressApp.use(express.static("static"));
expressApp.use(express.static("node_modules/bootstrap/dist"));
expressApp.use((req, res) => proxy.web(req, res));
const server = createServer(expressApp);
server.on("upgrade", (req, socket, head) => proxy.ws(req, socket, head));
server.listen(port, 
  () => console.log(`HTTP Server listening  on port ${port}`)
);
