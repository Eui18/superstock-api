import { NextFunction, Request, Response } from "express";
import * as authService from "../services/authService";

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.register(req.body ?? {});
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function login(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const result = await authService.login(req.body ?? {});

        console.info("[POST /api/login] 200 Inicio de sesión exitoso");

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}