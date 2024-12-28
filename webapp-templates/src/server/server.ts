import { createServer } from "http";
import express, { Express } from "express";
import { testHandler } from "./testHandler";
import httpProxy from "http-proxy";
import helmet from "helmet";
import { registerCustomTemplateEngine } from "./custom_engine";

const port = 5000;
const expressApp: Express = express();
const proxy = httpProxy.createProxyServer({
    target: "http://localhost:5100", ws: true
});

// Sets up the custom template engine
registerCustomTemplateEngine(expressApp);
// The ExpressApp.set method changes the template file location
expressApp.set("views", "templates/server");
expressApp.use(helmet());
expressApp.use(express.json());
expressApp.get("/dynamic/:file", (req, resp) => {
    // The request handler invokes the Response.render method,
    // which is responsible for rendering a template.
    resp.render(`${req.params.file}.custom`, { message: "Hello template", req });
});
expressApp.post("/test", testHandler);
expressApp.use(express.static("static"));
expressApp.use(express.static("node_modules/bootstrap/dist"));
expressApp.use((req, resp) => proxy.web(req, resp));
const server = createServer(expressApp);
server.on('upgrade', (req, socket, head) => proxy.ws(req, socket, head));
server.listen(port,
    () => console.log(`HTTP Server listening on port ${port}`));