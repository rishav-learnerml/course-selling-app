import { NextFunction, Request, Response } from "express";
import { AdminMiddlewareStrategy, Middleware } from "./middlewareStrategy";

const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const middleware: Middleware = new Middleware(
    new AdminMiddlewareStrategy()
  );
  middleware.executeMiddleware(req, res, next);
};

export default adminMiddleware;
