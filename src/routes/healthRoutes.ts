import { Router } from "express";
import { Pool } from "mysql2/promise";
import { asyncHandler } from "../middlewares/asyncHandler";

export function createHealthRoutes(pool: Pool): Router {
  const router = Router();

  router.get("/", (req, res) => {
    res.status(200).json({ msg: "SuperStock API funcionando", data: null });
  });

  router.get(
    "/db",
    asyncHandler(async (req, res) => {
      await pool.query("SELECT 1");
      res.status(200).json({ msg: "Conexión a MySQL correcta", data: null });
    })
  );

  return router;
}