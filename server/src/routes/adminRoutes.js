import express from "express";

import { createAdmin, loginAdmin } from "../controllers/adminController.js";

const router = express.Router();

// =========================================================
// ADMIN ACCOUNT
// =========================================================

// DEVELOPMENT-ONLY ADMIN SETUP
if (process.env.NODE_ENV !== "production") {
  router.post("/setup", createAdmin);
}

// ADMIN LOGIN
// POST /api/admin/login
router.post("/login", loginAdmin);

export default router;
