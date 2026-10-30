import "dotenv/config";
import app from "./app";
import pool from "./config/db";

const port = Number(process.env.PORT) || 3000;

async function start(): Promise<void> {
  try {
    const connection = await pool.getConnection();
    connection.release();

    app.listen(port, () => {
      console.log(`Servidor escuchando en el puerto ${port}`);
    });
  } catch (error) {
    console.error("No se pudo conectar a MySQL. El servidor no arrancó:", error);
    process.exit(1);
  }
}

start();