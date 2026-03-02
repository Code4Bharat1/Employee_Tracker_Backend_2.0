import express from "express";

import {

createTesting,
getAllTesting,
getTestingById,
approveTesting,
rejectTesting,
deleteTesting,

} from "../controllers/testing.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, createTesting);

router.get("/", verifyToken, getAllTesting);

router.get("/:id", verifyToken, getTestingById);

router.put("/approve/:id", verifyToken, approveTesting);

router.put("/reject/:id", verifyToken, rejectTesting);

router.delete("/:id", verifyToken, deleteTesting);

export default router;