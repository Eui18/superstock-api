import { Product } from "../models/product";

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  active: boolean;
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  active: boolean;
}

export function toProductResponse(product: Product): ProductResponse {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    category: product.category,
    active: product.active,
  };
}