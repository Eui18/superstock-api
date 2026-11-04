import { User } from "../models/user";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export function toUserResponse(user: User): UserResponse {
  return { id: user.id, name: user.name, email: user.email };
}