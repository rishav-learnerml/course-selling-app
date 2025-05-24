import { NextFunction, Request, Response } from "express";
import { Middleware, UserMiddlewareStrategy } from "./middlewareStrategy";

const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const middleareStrategy: Middleware = new Middleware(
    new UserMiddlewareStrategy()
  );
  middleareStrategy.executeMiddleware(req, res, next);
};

export default adminMiddleware;
