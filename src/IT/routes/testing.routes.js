import express from "express";
import {
  getTestingDashboard,
  getTestingProjects,
  validatePhase,
  markPhaseCompleted,
  createBug,
  updateBugStatus,
  getBugs,
  getLeaderboard,
} from "../controllers/testing.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { onlyTestingManager } from "../middlewares/role.middleware.js";

const router = express.Router();

// dashboard
router.get("/dashboard", protect, getTestingDashboard);

// projects
router.get("/projects", protect, getTestingProjects);
router.put("/projects/:id/validate", protect, validatePhase);
router.put("/projects/:id/complete", protect, markPhaseCompleted);

// bugs
router.get("/bugs", protect, getBugs);
router.post("/bugs", protect, createBug);
router.put("/bugs/:bugId/status", protect, updateBugStatus);

// leaderboard
router.get("/leaderboard", protect, getLeaderboard);

export default router;