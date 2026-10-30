import { Router } from "express";
import { ProductController } from "../controllers/productController";
import { asyncHandler } from "../middlewares/asyncHandler";

export function createProductRoutes(controller: ProductController): Router {
  const router = Router();

  router.get("/", asyncHandler(controller.getAll));
  router.get("/:id", asyncHandler(controller.getById));
  router.post("/", asyncHandler(controller.create));
  router.put("/:id", asyncHandler(controller.update));
  router.delete("/:id", asyncHandler(controller.remove));

  return router;
}