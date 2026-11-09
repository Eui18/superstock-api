import { User } from "../models/user";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(name: string, email: string, passwordHash: string): Promise<User>;
}