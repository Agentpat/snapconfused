import express from "express";

import {
  createConfession,
  getConfessions,
  getApprovedConfessions,
  getFeaturedConfessions,
  approveConfession,
  featureConfession,
  unfeatureConfession,
  deleteConfession,
} from "../controllers/confessionController.js";

import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// =========================================================
// PUBLIC
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

// GET ALL CONFESSIONS
// GET /api/confessions
//
// Used by:
// - Admin

router.get("/", getConfessions);

// =========================================================
// ADMIN
// =========================================================

// APPROVE CONFESSION
// PATCH /api/confessions/:id/approve

router.patch("/:id/approve", adminAuth, approveConfession);

// FEATURE CONFESSION
// PATCH /api/confessions/:id/feature

router.patch("/:id/feature", adminAuth, featureConfession);

// UNFEATURE CONFESSION
// PATCH /api/confessions/:id/unfeature

router.patch("/:id/unfeature", adminAuth, unfeatureConfession);

// DELETE CONFESSION
// DELETE /api/confessions/:id

router.delete("/:id", adminAuth, deleteConfession);

export default router;
