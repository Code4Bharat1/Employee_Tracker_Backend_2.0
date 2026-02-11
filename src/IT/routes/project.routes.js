import express from "express";
import {
    createProject,
    getProjects,
    updateProject,
    deleteProject,
    updateProjectStatus,
    getProjectById,
}from "../controllers/project.controller.js";
import{protect}from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/create-project", protect, createProject);
router.get("/get-projects", protect, getProjects);
router.get("/single-project/:id", protect, getProjectById);
router.put("/update-project/:id", protect, updateProject);
router.patch("/status/:id", protect, updateProjectStatus);
router.delete("/delete/:id", protect, deleteProject);

export default router;