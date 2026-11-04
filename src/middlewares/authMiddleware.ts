import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";
import { verifyToken } from "../utils/token";

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (header === undefined || !header.startsWith("Bearer ")) {
    throw new AppError(401, "Falta el token de autenticación");
  }
  res.locals.userId = verifyToken(header.slice(7));
  next();
}