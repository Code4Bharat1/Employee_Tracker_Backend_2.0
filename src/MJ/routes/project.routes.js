import express from "express";
import { createProject, deleteProject, getProjects, updateProject } from "../controllers/project.controller";
import { protect } from "../middleware/auth.middleware";
import { allowRoles } from "../middleware/role.middleware";


const router=express.Router();

router.post("/create-project",protect,createProject);
router.get("/get-projects",protect,getProjects);
router.put("/update-project/:id",protect,updateProject);
router.delete("/delete-project/:id",protect,deleteProject);

export default router;