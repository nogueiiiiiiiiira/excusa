import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import clientsRoutes from "./routes/clientsRoutes.js";
import proceduresRoutes from "./routes/proceduresRoutes.js";
import appointmentsRoutes from "./routes/appointmentsRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import pool from "./config/database.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();
const port = Number(process.env.PORT) || 5000;
const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const frontendDirectory = path.resolve(currentDirectory, "../frontend/dist");
const frontendEntry = path.join(frontendDirectory, "index.html");

// enable cross-origin requests from frontend
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
// parse json request bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(frontendEntry);
});

app.get("/home", (req, res) => {
  res.sendFile(frontendEntry);
});

// crud operations
app.use("/clients", clientsRoutes);
app.use("/procedures", proceduresRoutes);
app.use("/appointments", appointmentsRoutes);
app.use("/history", historyRoutes);

app.use(express.static(frontendDirectory));

app.get(
  /^(?!\/clients(?:\/|$)|\/procedures(?:\/|$)|\/appointments(?:\/|$)|\/history(?:\/|$)).*/,
  (req, res) => {
    res.sendFile(frontendEntry);
  },
);

app.use(notFoundHandler);
app.use(errorHandler);

pool
  .getConnection()
  .then((connection) => {
    connection.release();
    console.log("\nMySQL connection established successfully!\n");
  })
  .catch((error) => {
    console.error("\nError trying to connect to MySQL:", error.message);
  });

app.listen(port, () => {
  console.log(`\n[RUNNING ON]: PORT ${port}`);
});

console.log("\n[DB_DATABASE]:", process.env.DB_DATABASE);
