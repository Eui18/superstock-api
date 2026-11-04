import { NextFunction, Request, Response } from "express";
import { toProductResponse } from "../dtos/productDto";
import * as productService from "../services/productService";

function getUserId(res: Response): number {
  return res.locals.userId as number;
}

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const products = await productService.listProducts(getUserId(res));
    res.status(200).json(products.map(toProductResponse));
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await productService.getProduct(getUserId(res), Number(req.params.id));
    res.status(200).json(toProductResponse(product));
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await productService.createProduct(getUserId(res), req.body ?? {});
    res.status(201).json(toProductResponse(product));
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await productService.updateProduct(getUserId(res), Number(req.params.id), req.body ?? {});
    res.status(200).json(toProductResponse(product));
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await productService.deleteProduct(getUserId(res), Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}