import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ msg: "SuperStock API funcionando", data: null });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.use((req, res) => {
  res.status(404).json({ msg: "Ruta no encontrada", data: null });
});

export default app;