import { ProductRequest } from "../dtos/productDto";
import { Product } from "../models/product";

export interface ProductRepository {
  findAllByUser(userId: number): Promise<Product[]>;
  findByIdAndUser(id: number, userId: number): Promise<Product | null>;
  create(userId: number, data: ProductRequest): Promise<Product>;
  update(id: number, userId: number, data: ProductRequest): Promise<Product | null>;
  remove(id: number, userId: number): Promise<boolean>;
}