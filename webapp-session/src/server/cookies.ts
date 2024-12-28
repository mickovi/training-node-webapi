import { IncomingMessage, ServerResponse } from "http";
import { signCookie, validateCookie } from "./cookies_signed";

// Cookies are sent to the browser using the Set-Cookie header.
const setHeaderName = "Set-Cookie";
const cookieSecret = "mysecret";

export const setCookie = (res: ServerResponse, name: string, val: string) => {
  const signedCookieVal = signCookie(val, cookieSecret);
  // let cookieVal: any[] = [`{${name}=${val}; Max-Age=300, SameSite=Strict}`];
  let cookieVal: any[] = [
    `{${name}=${signedCookieVal}; Max-Age=300, SameSite=Strict}`,
  ];
  // A response can set multiple cookies by including multiple Set-Cookie headers.
  if (res.hasHeader(setHeaderName)) {
    cookieVal.push(res.getHeader(setHeaderName));
  }
  res.setHeader("Set-Cookie", cookieVal);
};

export const setJsonCookie = (res: ServerResponse, name: string, val: any) => {
  setCookie(res, name, JSON.stringify(val));
};

export const getCookie = (
  req: IncomingMessage,
  key: string
): string | undefined => {
  let result: string | undefined = undefined;
  req.headersDistinct["cookie"]?.forEach((header) =>
    header.split(";").forEach((cookie) => {
      const { name, val } = /^(?<name>.*)=(?<val>.*)$/.exec(cookie)
        ?.groups as any;
      // When key = "personalHistory"
      if (name.trim() === key) {
        // result = val;
        // val = "pHistory.[hashCode]"
        result = validateCookie(val, cookieSecret);
      }
    })
  );
  return result;
};

export const getJsonCookie = (req: IncomingMessage, key: string): any => {
  const cookie = getCookie(req, key);
  return cookie ? JSON.parse(cookie) : undefined;
};
