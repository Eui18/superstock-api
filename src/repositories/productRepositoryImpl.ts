import { Pool } from "mysql2/promise";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Product, ProductInput } from "../models/productModel";
import { ProductRepository } from "./productRepository";

export class ProductRepositoryImpl implements ProductRepository {
  constructor(private pool: Pool) {}

  async findAll(): Promise<Product[]> {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      "SELECT * FROM products WHERE is_active = 1"
    );
    return rows as Product[];
  }

  async findById(id: number): Promise<Product | null> {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      "SELECT * FROM products WHERE id = ? AND is_active = 1",
      [id]
    );
    return rows.length > 0 ? (rows[0] as Product) : null;
  }

  async create(data: ProductInput): Promise<number> {
    const [result] = await this.pool.query<ResultSetHeader>(
      "INSERT INTO products (name, description, price, stock, min_stock, category_id) VALUES (?, ?, ?, ?, ?, ?)",
      [data.name, data.description ?? null, data.price, data.stock ?? 0, data.min_stock ?? 0, data.category_id ?? null]
    );
    return result.insertId;
  }

  async update(id: number, data: ProductInput): Promise<boolean> {
    const [result] = await this.pool.query<ResultSetHeader>(
      "UPDATE products SET name = ?, description = ?, price = ?, stock = ?, min_stock = ?, category_id = ? WHERE id = ? AND is_active = 1",
      [data.name, data.description ?? null, data.price, data.stock ?? 0, data.min_stock ?? 0, data.category_id ?? null, id]
    );
    return result.affectedRows > 0;
  }

  async deactivate(id: number): Promise<boolean> {
    const [result] = await this.pool.query<ResultSetHeader>(
      "UPDATE products SET is_active = 0 WHERE id = ? AND is_active = 1",
      [id]
    );
    return result.affectedRows > 0;
  }
}