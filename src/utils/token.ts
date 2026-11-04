import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "./appError";

export function generateToken(userId: number): string {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  };
  return jwt.sign({ userId: userId }, env.jwtSecret, options);
}

export function verifyToken(token: string): number {
  let payload: string | JwtPayload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new AppError(401, "Token inválido o expirado");
  }
  if (typeof payload === "string" || typeof payload.userId !== "number") {
    throw new AppError(401, "Token inválido");
  }
  return payload.userId;
}