import { Router } from "express";
import {
  getProjectSummary,
  getUsersSummary,
  getWorklogReport,
  getMonthlyReport,
  getTaskStatusReport
} from "../controllers/report.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/project/:projectId", protect, getProjectSummary);
router.get("/user/:userId", protect, getUsersSummary);
router.get("/worklogs", protect, getWorklogReport);
router.get("/monthly", protect, getMonthlyReport);
router.get("/tasks/status", protect, getTaskStatusReport);

export default router;