import express from "express";

import { createAdmin, loginAdmin } from "../controllers/adminController.js";

const router = express.Router();

// =========================================================
// DEVELOPMENT ADMIN SETUP
// POST /api/admin/setup
//
// This endpoint is ONLY available during development.
// It is disabled automatically in production.
// =========================================================

if (process.env.NODE_ENV !== "production") {
  router.post("/setup", createAdmin);
}

// =========================================================
// ADMIN LOGIN
// POST /api/admin/login
//
// Always available.
// =========================================================

router.post("/login", loginAdmin);

export default router;
