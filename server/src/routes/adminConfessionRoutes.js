import express from "express";

import {
  getAdminConfessions,
  getAdminConfession,
  createAdminConfession,
  importAdminConfessions,
  featureAdminConfession,
  unfeatureAdminConfession,
  scheduleAdminConfession,
  publishAdminConfession,
  deleteAdminConfession,
} from "../controllers/adminConfessionController.js";

import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| ADMIN CONFESSION CONTENT
|--------------------------------------------------------------------------
| This is the content operations layer.
|
| Moderation is intentionally not part of the workflow.
| Confessions are automatically accepted and controlled through
| publication status:
|
| - unpublished
| - scheduled
| - published
|
| Bulk JSON imports are also handled here.
|--------------------------------------------------------------------------
*/

// =========================================================
// GET ALL ADMIN CONFESSIONS
// GET /api/admin/confessions
// =========================================================

router.get("/", adminAuth, getAdminConfessions);

// =========================================================
// CREATE SINGLE CONFESSION
// POST /api/admin/confessions
// =========================================================

router.post("/", adminAuth, createAdminConfession);

// =========================================================
// BULK IMPORT CONFESSIONS
// POST /api/admin/confessions/import
//
// IMPORTANT:
// This must come before /:id so "import" is not treated
// as a confession ID.
// =========================================================

router.post("/import", adminAuth, importAdminConfessions);

// =========================================================
// GET SINGLE CONFESSION
// GET /api/admin/confessions/:id
// =========================================================

router.get("/:id", adminAuth, getAdminConfession);

// =========================================================
// FEATURE / HALL OF SHAME
// PATCH /api/admin/confessions/:id/feature
// =========================================================

router.patch("/:id/feature", adminAuth, featureAdminConfession);

// =========================================================
// REMOVE FROM HALL OF SHAME
// PATCH /api/admin/confessions/:id/unfeature
// =========================================================

router.patch("/:id/unfeature", adminAuth, unfeatureAdminConfession);

// =========================================================
// SCHEDULE CONFESSION
// PATCH /api/admin/confessions/:id/schedule
// =========================================================

router.patch("/:id/schedule", adminAuth, scheduleAdminConfession);

// =========================================================
// PUBLISH CONFESSION
// PATCH /api/admin/confessions/:id/publish
// =========================================================

router.patch("/:id/publish", adminAuth, publishAdminConfession);

// =========================================================
// DELETE CONFESSION
// DELETE /api/admin/confessions/:id
// =========================================================

router.delete("/:id", adminAuth, deleteAdminConfession);

export default router;
