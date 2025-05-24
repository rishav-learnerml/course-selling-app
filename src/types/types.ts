import { CookieOptions } from "express";

interface CookieType extends CookieOptions {
  token: String | undefined;
}

export { CookieType };
