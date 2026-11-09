import bcrypt from "bcryptjs";
import { AuthResponse, toUserResponse } from "../dtos/authDto";
import { UserRepository } from "../repositories/userRepository";
import { UserRepositoryImpl } from "../repositories/userRepositoryImpl";
import { AppError } from "../utils/appError";
import { generateToken } from "../utils/token";

const userRepository: UserRepository = new UserRepositoryImpl();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_BYTES = 72;

function readText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function register(body: Record<string, unknown>): Promise<AuthResponse> {
  const name = readText(body.name);
  const email = readText(body.email).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";

  if (name === "") {
    throw new AppError(400, "Escribe tu nombre");
  }
  if (name.length > 100) {
    throw new AppError(400, "El nombre no puede tener más de 100 caracteres");
  }
  if (!EMAIL_REGEX.test(email) || email.length > 150) {
    throw new AppError(400, "Escribe un correo válido");
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new AppError(400, "La contraseña debe tener al menos 8 caracteres");
  }
  if (Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES) {
    throw new AppError(400, "La contraseña es demasiado larga");
  }

  const existing = await userRepository.findByEmail(email);
  if (existing !== null) {
    throw new AppError(409, "Ese correo ya está registrado");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userRepository.create(name, email, passwordHash);
  return { token: generateToken(user.id), user: toUserResponse(user) };
}

export async function login(body: Record<string, unknown>): Promise<AuthResponse> {
  const email = readText(body.email).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";

  if (email === "" || password === "") {
    throw new AppError(400, "Escribe tu correo y tu contraseña");
  }

  const user = await userRepository.findByEmail(email);
  const passwordOk = user !== null && (await bcrypt.compare(password, user.passwordHash));
  if (user === null || !passwordOk) {
    throw new AppError(401, "Correo o contraseña incorrectos");
  }

  return { token: generateToken(user.id), user: toUserResponse(user) };
}