import express from 'express';
import { createTask, deleteTask, getTasks, updateTask } from '../controllers/task.controller.js';

const router = express.Router();
router.post("/create-task", protect, createTask);
router.get("/get-task", protect, getTasks);
router.put("/update-task/:id", protect, updateTask);
router.delete("/delete-task/:id", protect, deleteTask);

export default router;
