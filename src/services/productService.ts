import { ProductRequest } from "../dtos/productDto";
import { Product } from "../models/product";
import * as productRepository from "../repositories/productRepository";
import { AppError } from "../utils/appError";

const MAX_PRICE = 99999999.99;
const MAX_INT = 2147483647;

function readText(value: unknown, label: string, maxLength: number): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new AppError(400, "Escribe " + label);
  }
  const text = value.trim();
  if (text.length > maxLength) {
    throw new AppError(400, "Máximo " + maxLength + " caracteres en " + label);
  }
  return text;
}

function readDescription(value: unknown): string {
  if (value === undefined || value === null) {
    return "";
  }
  if (typeof value !== "string") {
    throw new AppError(400, "La descripción debe ser texto");
  }
  const text = value.trim();
  if (text.length > 255) {
    throw new AppError(400, "Máximo 255 caracteres en la descripción");
  }
  return text;
}

function validateProduct(body: Record<string, unknown>): ProductRequest {
  const name = readText(body.name, "el nombre", 150);
  const category = readText(body.category, "la categoría", 100);
  const description = readDescription(body.description);

  const price = body.price;
  if (typeof price !== "number" || !Number.isFinite(price) || price < 0 || price > MAX_PRICE) {
    throw new AppError(400, "El precio debe ser un número entre 0 y " + MAX_PRICE);
  }

  const stock = body.stock;
  if (typeof stock !== "number" || !Number.isInteger(stock) || stock < 0 || stock > MAX_INT) {
    throw new AppError(400, "El stock debe ser un número entero mayor o igual a 0");
  }

  const active = body.active;
  if (typeof active !== "boolean") {
    throw new AppError(400, "El campo active debe ser true o false");
  }

  return { name, description, price, stock, category, active };
}

function assertValidId(id: number): void {
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, "El id no es válido");
  }
}

export async function listProducts(userId: number): Promise<Product[]> {
  return productRepository.findAllByUser(userId);
}

export async function getProduct(userId: number, id: number): Promise<Product> {
  assertValidId(id);
  const product = await productRepository.findByIdAndUser(id, userId);
  if (product === null) {
    throw new AppError(404, "Producto no encontrado");
  }
  return product;
}

export async function createProduct(userId: number, body: Record<string, unknown>): Promise<Product> {
  const data = validateProduct(body);
  return productRepository.create(userId, data);
}

export async function updateProduct(userId: number, id: number, body: Record<string, unknown>): Promise<Product> {
  assertValidId(id);
  const data = validateProduct(body);
  const product = await productRepository.update(id, userId, data);
  if (product === null) {
    throw new AppError(404, "Producto no encontrado");
  }
  return product;
}

export async function deleteProduct(userId: number, id: number): Promise<void> {
  assertValidId(id);
  const deleted = await productRepository.remove(id, userId);
  if (!deleted) {
    throw new AppError(404, "Producto no encontrado");
  }
}