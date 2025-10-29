import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import routeRoutes from "./routes/routeRoutes.js";
import standRoutes from "./routes/standRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";

dotenv.config();
const app = express();

// ✅ Proper CORS setup
app.use(
  cors({
    origin: "http://localhost:5173", // your Vite frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // if you're using cookies or auth headers
  })
);

// Middleware
app.use(express.json());

// ✅ MongoDB Connection
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in .env");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Connection error:", err));

// Routes
app.use("/api/routes", routeRoutes);
app.use("/api/stands", standRoutes);
app.use("/api/trips", tripRoutes);

// Server startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
