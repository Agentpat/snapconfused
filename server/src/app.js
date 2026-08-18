import express from "express";
import cors from "cors";

import confessionRoutes from "./routes/confessionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";

const app = express();

// =========================================================
// ENVIRONMENT
// =========================================================

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// =========================================================
// MIDDLEWARE
// =========================================================

app.use(
  cors({
    origin: CLIENT_URL,
  }),
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// =========================================================
// HEALTH CHECK
// =========================================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,

    message: "SnapConfused API is running.",
  });
});

// =========================================================
// ROOT
// =========================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,

    message: "Welcome to SnapConfused API.",
  });
});

// =========================================================
// API ROUTES
// =========================================================

app.use("/api/confessions", confessionRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/subscribers", subscriberRoutes);

// =========================================================
// 404
// =========================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,

    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =========================================================
// ERROR HANDLER
// =========================================================

app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.statusCode || 500).json({
    success: false,

    message: error.message || "Something went wrong.",
  });
});

export default app;
