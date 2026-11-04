import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { AppError } from "../utils/appError";

export function errorHandler(error: unknown, req: Request, res: Response, next: NextFunction): void {
  const where = "[" + req.method + " " + req.originalUrl + "] ";

  if (error instanceof AppError) {
    console.warn(where + error.statusCode + " " + error.message);
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  if (typeof error === "object" && error !== null && "type" in error && error.type === "entity.parse.failed") {
    console.warn(where + "400 JSON inválido en el cuerpo");
    res.status(400).json({ message: "El cuerpo de la petición no es un JSON válido" });
    return;
  }

  console.error(where + "Error inesperado:", error);
  const body: { message: string; detail?: string } = { message: "Error interno del servidor" };
  if (env.nodeEnv !== "production") {
    body.detail = error instanceof Error ? error.message : String(error);
  }
  res.status(500).json(body);
}