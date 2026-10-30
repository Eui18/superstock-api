import pool from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function getUserByEmail(email: string) {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  if (rows.length === 0) {
    return null;
  }
  return rows[0];
}

export async function createUser(name: string, email: string, password: string) {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password]
  );
  return result.insertId;
}