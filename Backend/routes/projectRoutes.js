import express from "express";
import upload from "../utils/multer.js";
import { addProject, getProjects, deleteProject } from "../controllers/projectController.js";

const router = express.Router();

// نام فیلد فایل در فرانت‌اند باید "image" باشد
router.post("/", upload.single("image"), addProject);
router.get("/", getProjects);
router.delete("/:id", deleteProject);

export default router;