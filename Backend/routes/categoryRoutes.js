import express from "express";
import { createCategory, createSubCategory, getAllCategories } from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", createCategory);      // ساخت دسته
router.post("/sub", createSubCategory); // ساخت زیرمجموعه
router.get("/", getAllCategories);     // دریافت همه

export default router;