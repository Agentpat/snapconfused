import express from "express";

import {
  createConfession,
  getConfessions,
  getApprovedConfessions,
  getFeaturedConfessions,
} from "../controllers/confessionController.js";

const router = express.Router();

// =========================================================
// PUBLIC CONFESSIONS
// =========================================================

// CREATE CONFESSION
// POST /api/confessions
router.post("/", createConfession);

// GET APPROVED CONFESSIONS
// GET /api/confessions/approved
//
// Used by:
// - The Struggles page
router.get("/approved", getApprovedConfessions);

// GET FEATURED CONFESSIONS
// GET /api/confessions/featured
//
// Used by:
// - Homepage confession carousel
// - Hall of Shame
router.get("/featured", getFeaturedConfessions);

// GET CONFESSIONS
// GET /api/confessions
//
// Public confession listing endpoint.
// Admin management is handled separately through:
// /api/admin/confessions
router.get("/", getConfessions);

export default router;
