import { Request, Response } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../models/productModel";

export async function getAll(req: Request, res: Response) {
  try {
    const products = await getAllProducts();
    return res.status(200).json({ msg: "Lista de productos", data: products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error interno del servidor", data: null });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ msg: "El id no es válido", data: null });
    }

    const product = await getProductById(id);
    if (product === null) {
      return res.status(404).json({ msg: "Producto no encontrado", data: null });
    }

    return res.status(200).json({ msg: "Producto encontrado", data: product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error interno del servidor", data: null });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const { name, description, price, stock, min_stock, category_id } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ msg: "El nombre es obligatorio", data: null });
    }
    if (typeof price !== "number" || price < 0) {
      return res.status(400).json({ msg: "El precio debe ser un número mayor o igual a 0", data: null });
    }

    const newId = await createProduct(
      name,
      description ?? null,
      price,
      stock ?? 0,
      min_stock ?? 0,
      category_id ?? null
    );
    const product = await getProductById(newId);

    return res.status(201).json({ msg: "Producto creado", data: product });
  } catch (error: any) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ msg: "La categoría indicada no existe", data: null });
    }
    console.error(error);
    return res.status(500).json({ msg: "Error interno del servidor", data: null });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ msg: "El id no es válido", data: null });
    }

    const { name, description, price, stock, min_stock, category_id } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ msg: "El nombre es obligatorio", data: null });
    }
    if (typeof price !== "number" || price < 0) {
      return res.status(400).json({ msg: "El precio debe ser un número mayor o igual a 0", data: null });
    }

    const updated = await updateProduct(
      id,
      name,
      description ?? null,
      price,
      stock ?? 0,
      min_stock ?? 0,
      category_id ?? null
    );
    if (!updated) {
      return res.status(404).json({ msg: "Producto no encontrado", data: null });
    }

    const product = await getProductById(id);
    return res.status(200).json({ msg: "Producto actualizado", data: product });
  } catch (error: any) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ msg: "La categoría indicada no existe", data: null });
    }
    console.error(error);
    return res.status(500).json({ msg: "Error interno del servidor", data: null });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ msg: "El id no es válido", data: null });
    }

    const deleted = await deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ msg: "Producto no encontrado", data: null });
    }

    return res.status(200).json({ msg: "Producto eliminado", data: null });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error interno del servidor", data: null });
  }
}