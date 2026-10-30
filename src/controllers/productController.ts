import { Request, Response } from "express";
import { ProductService } from "../services/productService";
import { AppError } from "../errors/appError";

function parseId(value: string): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, "El id no es válido");
  }
  return id;
}

export class ProductController {
  constructor(private service: ProductService) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    const products = await this.service.getAll();
    res.status(200).json({ 
        msg: "Lista de productos", 
        data: products 
    });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const product = await this.service.getById(parseId(String(req.params.id)));
    res.status(200).json({ 
        msg: "Producto encontrado", 
        data: product 
    });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const product = await this.service.create(req.body ?? {});
    res.status(201).json({ 
        msg: "Producto creado", 
        data: product 
    });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const product = await this.service.update(parseId(String(req.params.id)), req.body ?? {});
    res.status(200).json({ 
        msg: "Producto actualizado", 
        data: product 
    });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.service.remove(parseId(String(req.params.id)));
    res.status(200).json({ 
        msg: "Producto eliminado", 
        data: null 
    });
  };
}