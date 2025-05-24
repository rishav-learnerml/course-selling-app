import { NextFunction, Request, Response } from "express";
import { Middleware, UserMiddlewareStrategy } from "./middlewareStrategy";

const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const middleware: Middleware = new Middleware(new UserMiddlewareStrategy());
  middleware.executeMiddleware(req, res, next);
};

export default userMiddleware;
