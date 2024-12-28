import { IncomingMessage, ServerResponse } from "http";
export const handler = async (req: IncomingMessage, res: ServerResponse) => {

  // Undestanding HTTP request
  /* console.log(`----- HTTP Method: ${req.method}, URL: ${req.url}`);
  console.log(`host: ${req.headers.host}`);
  console.log(`accept: ${req.headers.accept}`);
  console.log(`user-agent: ${req.headers["user-agent"]}`); */

  /* const parsedURL = new URL(req.url ?? "", `http://${req.headers.host}`);
  console.log(`protocol: ${parsedURL.protocol}`);
  console.log(`hostname: ${parsedURL.hostname}`);
  console.log(`port: ${parsedURL.host}`);
  console.log(`pathname: ${parsedURL.pathname}`);
  parsedURL.searchParams.forEach((val, key) => {
    console.log(`Search params: ${key}: ${val}`);
  });
  res.end("Hello, World"); */

  // Undestanding HTTP response
  const parsedURL = new URL(req.url ?? "", `http://${req.headers.host}`);
  if (req.method !== "GET" || parsedURL.pathname == "/favicon.ico") {
    res.writeHead(404, "NotFound");
    res.end();
    return;
  } else {
    res.writeHead(200, "OK");
    if (!parsedURL.searchParams.has("keyword")) {
      res.write("Hello, HTTP");
    } else {
      res.write(`Hello, ${parsedURL.searchParams.get("keyword")}`);
    }
    res.end();
    return;
  }
};