import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { worklogLock } from "../middlewares/lock.middleware.js";
import {upload} from "../middlewares/upload.middleware.js"
import { createWorklog, deleteWorkLog, getWorkLogs, updateMyWorklog} from "../controllers/worklog.controller.js";

const router = express.Router();

router.post("/create", protect, worklogLock, upload.single("screenShot"), createWorklog);
router.get("/list", protect, getWorkLogs);
router.put("/edit/:id", protect, updateMyWorklog);
router.delete("/delete/:id", protect, deleteWorkLog);

export default router;