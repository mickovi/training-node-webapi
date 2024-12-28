import { CookieOptions, Request, Response } from "express";

// Cookies are set using a cookie property defined by the Response object. opts allows
// the default cookie options to be overridden.

// - This middleware populates the Request object’s cookies property for 
// regular cookies and the signedCookies property for signed cookies
// setting signed: true.
// - Cookies are signed using an HMAC.

export const setCookie = (res: Response, name: string, val: string, opts?: CookieOptions) => {
  res.cookie(name, val, {
    maxAge: 300 * 1000,
    sameSite: "strict",
    signed: true,
    ...opts
  })
}

export const setJsonCookie = (res: Response, name: string, val: any) => {
  setCookie(res, name, JSON.stringify(val));
};

// - Cookies received in requests are available through the Request.cookies and 
// Request.signedCookies properties, which return objects whose properties 
// correspond to the names of the cookies in the request.
export const getCookie = (req: Request, key: string): string | undefined => {
  // Signed cookies are easily detected because the Response.cookie method creates 
  // signed cookie values with the prefix s., and the values are automatically 
  // verified using the secret key with which the middleware was configured.
  return req.signedCookies[key];
};

export const getJsonCookie = (req: Request, key: string): any => {
  const cookie = getCookie(req, key);
  return cookie ? JSON.parse(cookie) : undefined;
};
