import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/database";
import { ProductRequest } from "../dtos/productDto";
import { Product } from "../models/product";
import { ProductRepository } from "./productRepository";

interface ProductRow extends RowDataPacket {
  id: number;
  user_id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  unit: string;
  category: string;
  is_active: number;
}

const COLUMNS = "id, user_id, name, description, price, stock, unit, category, is_active";

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description,
    price: row.price,
    stock: row.stock,
    unit: row.unit,
    category: row.category,
    active: row.is_active === 1,
  };
}

export class ProductRepositoryImpl implements ProductRepository {
  async findAllByUser(userId: number): Promise<Product[]> {
    const [rows] = await pool.query<ProductRow[]>(
      "SELECT " + COLUMNS + " FROM products WHERE user_id = ? ORDER BY id DESC",
      [userId]
    );
    return rows.map(toProduct);
  }

  async findByIdAndUser(id: number, userId: number): Promise<Product | null> {
    const [rows] = await pool.query<ProductRow[]>(
      "SELECT " + COLUMNS + " FROM products WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    if (rows.length === 0) {
      return null;
    }
    return toProduct(rows[0]);
  }

  async create(userId: number, data: ProductRequest): Promise<Product> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO products (user_id, name, description, price, stock, unit, category, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [userId, data.name, data.description, data.price, data.stock, data.unit, data.category, data.active ? 1 : 0]
    );
    return { id: result.insertId, userId: userId, ...data };
  }

  async update(id: number, userId: number, data: ProductRequest): Promise<Product | null> {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE products SET name = ?, description = ?, price = ?, stock = ?, unit = ?, category = ?, is_active = ? WHERE id = ? AND user_id = ?",
      [data.name, data.description, data.price, data.stock, data.unit, data.category, data.active ? 1 : 0, id, userId]
    );
    if (result.affectedRows === 0) {
      return null;
    }
    return { id: id, userId: userId, ...data };
  }

  async remove(id: number, userId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM products WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    return result.affectedRows > 0;
  }
}