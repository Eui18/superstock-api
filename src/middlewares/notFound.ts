import { Request, Response } from "express";

export function notFound(req: Request, res: Response): void {
  res.status(404).json({
    msg: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    data: null,
  });
}