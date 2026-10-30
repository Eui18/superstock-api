import pool from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function getAllProducts() {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM products WHERE is_active = 1"
  );
  return rows;
}

export async function getProductById(id: number) {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM products WHERE id = ? AND is_active = 1",
    [id]
  );
  if (rows.length === 0) {
    return null;
  }
  return rows[0];
}

export async function createProduct(
  name: string,
  description: string | null,
  price: number,
  stock: number,
  minStock: number,
  categoryId: number | null
) {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO products (name, description, price, stock, min_stock, category_id) VALUES (?, ?, ?, ?, ?, ?)",
    [name, description, price, stock, minStock, categoryId]
  );
  return result.insertId;
}

export async function updateProduct(
  id: number,
  name: string,
  description: string | null,
  price: number,
  stock: number,
  minStock: number,
  categoryId: number | null
) {
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE products SET name = ?, description = ?, price = ?, stock = ?, min_stock = ?, category_id = ? WHERE id = ? AND is_active = 1",
    [name, description, price, stock, minStock, categoryId, id]
  );
  return result.affectedRows > 0;
}

export async function deleteProduct(id: number) {
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE products SET is_active = 0 WHERE id = ? AND is_active = 1",
    [id]
  );
  return result.affectedRows > 0;
}