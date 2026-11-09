import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/database";
import { User } from "../models/user";
import { UserRepository } from "./userRepository";

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
}

function toUser(row: UserRow): User {
  return { id: row.id, name: row.name, email: row.email, passwordHash: row.password };
}

export class UserRepositoryImpl implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.query<UserRow[]>(
      "SELECT id, name, email, password FROM users WHERE email = ?",
      [email]
    );
    if (rows.length === 0) {
      return null;
    }
    return toUser(rows[0]);
  }

  async create(name: string, email: string, passwordHash: string): Promise<User> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, passwordHash]
    );
    return { id: result.insertId, name: name, email: email, passwordHash: passwordHash };
  }
}