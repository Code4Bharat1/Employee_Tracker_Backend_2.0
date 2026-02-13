import express from 'express';
import { createTask, deleteTask, getTasks, updateTask,approveTask,rejectTask } from '../controllers/task.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import {allowRoles} from "../middleware/role.middleware.js"

const router = express.Router();
router.post("/create-task", protect, allowRoles("MARKETING_ADMIN","DEPARTMENT_HEAD"), createTask);
router.get("/get-task", protect, getTasks);
router.put("/update-task/:id", protect, updateTask);
router.delete("/delete-task/:id", protect, deleteTask);

router.patch("/:id/approve", approveTask);
router.patch("/:id/reject", rejectTask);

export default router;
