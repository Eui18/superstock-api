import app from "./app";
import { pool } from "./config/database";
import { env } from "./config/env";

async function start(): Promise<void> {
  try {
    const connection = await pool.getConnection();
    connection.release();
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error("No se pudo conectar a MySQL: " + detail);
    process.exit(1);
  }

  app.listen(env.port, "0.0.0.0", () => {
    console.log("API escuchando en el puerto " + env.port);
  });
}

start();