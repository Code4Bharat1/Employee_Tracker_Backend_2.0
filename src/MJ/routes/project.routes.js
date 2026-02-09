import express from "express";
import { createProject, deleteProject, getProjects, updateProject } from "../controllers/project.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";


const router=express.Router();

router.post("/create-project",allowRoles("MARKETING_ADMIN"),protect,createProject);
router.get("/get-projects",allowRoles("MARKETING_ADMIN"),protect,getProjects);
router.put("/update-project/:id",protect,allowRoles("MARKETING_ADMIN"),updateProject);
router.delete("/delete-project/:id",protect,allowRoles("MARKETING_ADMIN"),deleteProject);

export default router;