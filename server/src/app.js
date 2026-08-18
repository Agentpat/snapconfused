import express from "express";
import cors from "cors";

import confessionRoutes from "./routes/confessionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";

const app = express();

// =========================================================
// CORS
// =========================================================

const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL].filter(
  Boolean,
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header.
      // Useful for direct API/server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },

    credentials: true,
  }),
);

// =========================================================
// BODY PARSING
// =========================================================

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
  console.error("API Error:", error);

  // Handle CORS errors cleanly.
  if (error.message?.startsWith("CORS blocked origin:")) {
    return res.status(403).json({
      success: false,

      message: "Request blocked by CORS policy.",
    });
  }

  res.status(error.statusCode || 500).json({
    success: false,

    message: error.message || "Something went wrong.",
  });
});

export default app;
