import { createHmac, timingSafeEqual } from "node:crypto";

export const signCookie = (value: string, secret: string) => {
  // - hash-based message authentication codes (HMACs) are hash codes created 
  // using a secret key that can be used to verify data.
  // - The update method is used to apply the hashing algorithm to the cookie value, 
  // and the digest method returns the hash code in the Base64 URL encoding.
  return (
    value + "." + createHmac("sha512", secret).update(value).digest("base64url")
  );
};

export const validateCookie = (value: string, secret: string) => {
  const cookieValue = value.split(".")[0];
  const compareBuf = Buffer.from(signCookie(cookieValue, secret));
  const candidateBuf = Buffer.from(value);
  // timingSafeEqual performs a byte-by-byte comparison of two Buffer objects, 
  // which are created from the two hash codes to compare.
  if (
    compareBuf.length == candidateBuf.length &&
    timingSafeEqual(compareBuf, candidateBuf)
  ) {
    return cookieValue;
  }
  return undefined;
};
