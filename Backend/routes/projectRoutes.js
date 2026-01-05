import express from "express";
import upload from "../utils/multer.js";
import {
  addProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();

// CRUD routes
router.post("/", upload.single("image"), addProject); // Create
router.get("/", getProjects); // Read all
router.get("/:id", getProjectById); // Read one
router.put("/:id", upload.single("image"), updateProject); // ✅ PUT route
router.delete("/:id", deleteProject); // Delete

export default router;
