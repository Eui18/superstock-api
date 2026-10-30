import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/appError";

const DB_UNAVAILABLE_CODES = [
  "ECONNREFUSED",
  "ETIMEDOUT",
  "ENOTFOUND",
  "PROTOCOL_CONNECTION_LOST",
  "ER_ACCESS_DENIED_ERROR",
  "ER_CON_COUNT_ERROR",
];

export function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
  //Errores que lanzamos nosotros desde el servicio (400, 404...)
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ 
      msg: error.message, 
      data: null 
    });
  }

  //Problemas con el cuerpo de la petición
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      msg: "El JSON enviado no es válido", 
      data: null 
    });
  }
  if (error.type === "entity.too.large") {
    return res.status(413).json({ 
      msg: "El cuerpo de la petición es demasiado grande", 
      data: null 
    });
  }

  //Errores de MySQL causados por los datos enviados
  if (error.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(400).json({ 
      msg: "La categoría indicada no existe", 
      data: null 
    });
  }
  if (error.code === "ER_DATA_TOO_LONG" || error.code === "ER_WARN_DATA_OUT_OF_RANGE" || error.code === "ER_DATA_OUT_OF_RANGE") {
    return res.status(400).json({ 
      msg: "Alguno de los valores es demasiado largo o está fuera de rango", 
      data: null 
    });
  }
  if (error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ 
      msg: "Ya existe un registro con ese valor", 
      data: null 
    });
  }

  //MySQL no disponible: no es culpa del cliente ni un bug del código
  if (DB_UNAVAILABLE_CODES.includes(error.code)) {
    console.error("Base de datos no disponible:", error.code);
    return res.status(503).json({ 
      msg: "Base de datos no disponible", 
      data: null 
    });
  }

  //Cualquier otra cosa es inesperada: se registra completa y al cliente no se le revelan detalles
  console.error(error);
  return res.status(500).json({ 
    msg: "Error interno del servidor", 
    data: null 
  });
}