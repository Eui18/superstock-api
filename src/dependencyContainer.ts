import pool from "./config/db";
import { ProductRepositoryImpl } from "./repositories/productRepositoryImpl";
import { ProductService } from "./services/productService";
import { ProductController } from "./controllers/productController";
import { createProductRoutes } from "./routes/productRoutes";
import { createHealthRoutes } from "./routes/healthRoutes";

export function createContainer() {
  const productRepository = new ProductRepositoryImpl(pool);
  const productService = new ProductService(productRepository);
  const productController = new ProductController(productService);

  return {
    healthRoutes: createHealthRoutes(pool),
    productRoutes: createProductRoutes(productController),
  };
}