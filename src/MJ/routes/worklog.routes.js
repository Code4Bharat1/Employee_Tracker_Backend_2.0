import express from "express";
import { createWorklog, deleteWorklog, getWorklogs, updateWorklogStatus } from "../controllers/worklog.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import {upload} from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/create-worklog", protect, upload.single("screenshot"), createWorklog);
router.get("/get-worklog", protect, getWorklogs);
router.put("/update/:id", protect,updateWorklogStatus);
router.delete("/delete/:id", protect, deleteWorklog);

export default router;

