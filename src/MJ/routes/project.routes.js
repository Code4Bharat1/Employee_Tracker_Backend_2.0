import express from "express";
import { createProject, deleteProject, getProjects, updateProject,approveProject,rejectProject } from "../controllers/project.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";


const router=express.Router();

router.post("/create-project",protect,allowRoles("MARKETING_ADMIN"),createProject);
router.get("/get-projects",protect,allowRoles("MARKETING_ADMIN"),getProjects);
router.put("/update-project/:id",protect,allowRoles("MARKETING_ADMIN"),updateProject);
router.delete("/delete-project/:id",protect,allowRoles("MARKETING_ADMIN"),deleteProject);

router.patch("/:id/approve", approveProject);
router.patch("/:id/reject", rejectProject);

export default router;