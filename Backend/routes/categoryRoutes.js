import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

/* CATEGORY */
router.post("/", createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

/* SUB CATEGORY */
router.post("/sub", createSubCategory);
router.get("/sub", getAllSubCategories);
router.get("/sub/:id", getSubCategoryById);
router.put("/sub/:id", updateSubCategory);
router.delete("/sub/:id", deleteSubCategory);

