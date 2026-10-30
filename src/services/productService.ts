import { Product, ProductInput } from "../models/productModel";
import { ProductRepository } from "../repositories/productRepository";
import { AppError } from "../errors/appError";

export class ProductService {
  constructor(private repository: ProductRepository) {}

  async getAll(): Promise<Product[]> {
    return this.repository.findAll();
  }

  async getById(id: number): Promise<Product> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new AppError(404, "Producto no encontrado");
    }
    return product;
  }

  async create(data: ProductInput): Promise<Product> {
    this.validate(data);
    const id = await this.repository.create(data);
    return this.getById(id);
  }

  async update(id: number, data: Partial<ProductInput>): Promise<Product> {
    const current = await this.getById(id);

    const merged: ProductInput = {
      name: data.name ?? current.name,
      description: data.description !== undefined ? data.description : current.description,
      price: data.price ?? current.price,
      stock: data.stock ?? current.stock,
      min_stock: data.min_stock ?? current.min_stock,
      category_id: data.category_id !== undefined ? data.category_id : current.category_id,
    };

    this.validate(merged);
    await this.repository.update(id, merged);
    return this.getById(id);
  }

  async remove(id: number): Promise<void> {
    await this.getById(id);
    await this.repository.deactivate(id);
  }

  private validate(data: ProductInput): void {
    if (typeof data.name !== "string" || data.name.trim() === "") {
      throw new AppError(400, "El nombre es obligatorio");
    }
    if (typeof data.price !== "number" || !Number.isFinite(data.price) || data.price < 0) {
      throw new AppError(400, "El precio debe ser un número mayor o igual a 0");
    }
    if (data.stock !== undefined && (!Number.isInteger(data.stock) || data.stock < 0)) {
      throw new AppError(400, "El stock debe ser un entero mayor o igual a 0");
    }
    if (data.min_stock !== undefined && (!Number.isInteger(data.min_stock) || data.min_stock < 0)) {
      throw new AppError(400, "El stock mínimo debe ser un entero mayor o igual a 0");
    }
    if (data.category_id != null && (!Number.isInteger(data.category_id) || data.category_id <= 0)) {
      throw new AppError(400, "La categoría no es válida");
    }
  }
}