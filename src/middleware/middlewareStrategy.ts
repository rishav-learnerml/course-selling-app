import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

abstract class MiddlewareStrategy {
  private JWT_TOKEN!: string;

  public constructor(JWT_TOKEN: string) {
    this.JWT_TOKEN = JWT_TOKEN;
  }

  execute(req: Request, res: Response, next: NextFunction): void {
    try {
      const rawCookie = req.headers.cookie;

      if (!rawCookie) {
        res.status(401).json({ message: "No cookie found" });
        return;
      }
      const token = rawCookie.split("=")[1];

      if (!token) {
        res.status(401).json({ message: "Token not found in cookies" });
        return;
      }

      const decodedAdmin = jwt.verify(token, this.JWT_TOKEN) as { id: string };

      // Extend `req` to carry userId safely
      (req as any).userId = decodedAdmin.id;

      next();
    } catch (error) {
      res.status(403).json({
        message: "Unauthorized user or invalid token",
        error: error instanceof Error ? error.message : error,
      });
    }
  }
}

//user need not to know about which jwt token to pass it's encapsulated

class AdminMiddlewareStrategy extends MiddlewareStrategy {
  public constructor() {
    super(process.env.JWT_SECRET_ADMIN as string);
  }
}

class UserMiddlewareStrategy extends MiddlewareStrategy {
  public constructor() {
    super(process.env.JWT_SECRET_USER as string);
  }
}

class Middleware {
  private middlewareStrategy!: MiddlewareStrategy;

  public constructor(middlewareStrategy: MiddlewareStrategy) {
    this.middlewareStrategy = middlewareStrategy;
  }

  public executeMiddleware(req: Request, res: Response, next: NextFunction) {
    this.middlewareStrategy.execute(req, res, next);
  }
}

export {Middleware, MiddlewareStrategy,UserMiddlewareStrategy, AdminMiddlewareStrategy}
