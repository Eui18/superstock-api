import express, { NextFunction, Request, Response } from "express";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import { AppError } from "./utils/appError";

const app = express();

app.use(express.json());

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api", authRoutes);
app.use("/api/products", productRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(404, "Ruta no encontrada"));
});

app.use(errorHandler);

export default app;