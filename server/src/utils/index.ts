import crypto from "crypto";

const AUTH_SECRET = "NARUTO-HARRYPOTTER-ONEPIECE";

export const random = () => crypto.randomBytes(128).toString("base64");

export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(AUTH_SECRET)
    .digest("hex");
};
