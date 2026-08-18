import express from "express";

import { createSubscriber } from "../controllers/subscriberController.js";

const router = express.Router();

// =========================================================
// JOIN CONFIDENTIAL CLUB
// POST /api/subscribers
// =========================================================

router.post("/", createSubscriber);

export default router;
