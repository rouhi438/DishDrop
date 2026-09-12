require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { getJwtSecret, requireEnv } = require("./config/env");

const DEFAULT_ORIGINS = ["http://localhost:5173", "https://dish-drop-phi.vercel.app"];

function createApp() {
  getJwtSecret();
  const app = express();
  const configuredOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);
  const allowedOrigins = new Set([...DEFAULT_ORIGINS, ...configuredOrigins]);

  app.disable("x-powered-by");
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin.replace(/\/$/, ""))) return callback(null, true);
        return callback(new Error("Origin is not allowed by CORS"));
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));

  app.use("/", authRoutes);
  app.use("/recipes", recipeRoutes);
  app.use("/admin", adminRoutes);
  app.get("/ping", (_req, res) => res.json({ message: "pong", timestamp: new Date().toISOString() }));
  app.use((_req, res) => res.status(404).json({ error: "Route not found" }));
  app.use((error, _req, res, _next) => {
    console.error(error);
    const configurationError = error.message?.startsWith("Missing required environment variable");
    const status = error.name === "ValidationError" ? 400
      : error.code === 11000 ? 409
        : error.type === "entity.too.large" ? 413
          : error.message === "Origin is not allowed by CORS" ? 403
            : 500;
    res.status(status).json({
      error: configurationError ? "Server configuration error"
        : status === 400 ? "Invalid request data"
          : status === 409 ? "A record with this value already exists"
            : status === 413 ? "Request body is too large"
              : status === 403 ? "Origin is not allowed"
                : "Unexpected server error",
    });
  });
  return app;
}

async function startServer() {
  const app = createApp();
  await mongoose.connect(requireEnv("MONGO_URL"), { serverSelectionTimeoutMS: 30000, family: 4 });
  const port = process.env.PORT || 3000;
  return app.listen(port, () => console.log(`Backend running on port ${port}`));
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Backend failed to start:", error.message);
    process.exitCode = 1;
  });
}

module.exports = { createApp, startServer };
