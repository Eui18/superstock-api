import express from "express";
import cors from "cors";
import { createContainer } from "./dependencyContainer";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
const container = createContainer();

app.use(cors());
app.use(express.json());

app.use("/health", container.healthRoutes);
app.use("/api/products", container.productRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;