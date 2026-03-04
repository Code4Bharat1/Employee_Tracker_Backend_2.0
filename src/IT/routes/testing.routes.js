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
router.get("/dashboard", protect, onlyTestingManager, getTestingDashboard);

// projects
router.get("/projects", protect, onlyTestingManager, getTestingProjects);
router.put("/projects/:id/validate", protect, onlyTestingManager, validatePhase);
router.put("/projects/:id/complete", protect, onlyTestingManager, markPhaseCompleted);

// bugs
router.get("/bugs", protect, onlyTestingManager, getBugs);
router.post("/bugs", protect, onlyTestingManager, createBug);
router.put("/bugs/:bugId/status", protect, onlyTestingManager, updateBugStatus);

// leaderboard
router.get("/leaderboard", protect, onlyTestingManager, getLeaderboard);

export default router;