import { Product, ProductInput } from "../models/productModel";

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  create(data: ProductInput): Promise<number>;
  update(id: number, data: ProductInput): Promise<boolean>;
  deactivate(id: number): Promise<boolean>;
}