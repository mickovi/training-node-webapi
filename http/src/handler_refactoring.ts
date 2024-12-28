import { IncomingMessage, ServerResponse } from "http";
import { TLSSocket } from "tls";
import { URL } from "url";

/* Each response is created by a separate handler function, 
without the code that matches requests. */

export const isHttps = (req: IncomingMessage) : boolean => {
  return req.socket instanceof TLSSocket && req.socket.encrypted;
};

export const redirectionHandler = (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(302, {
    "Location": "https://localhost:5500"
  });
  res.end();
};

export const notFounderHandler = (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(404, "Not Found");
  res.end();
};

export const newUrlHandler = (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, "OK");
  res.write("Hello, new URL");
  res.end();
};

export const defaultHandler = (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, "OK");
  const protocol = isHttps(req) ? "https": "http";
  const parsedURL = new URL(req.url ?? "", `${protocol}://${req.headers.host}`);
  if (!parsedURL.searchParams.has("keyword")) {
    res.write(`Hello, ${protocol.toUpperCase()}`);
  } else {
    res.write(`Hello, ${parsedURL.searchParams.get("keyword")}`);
  }
  res.end();
};