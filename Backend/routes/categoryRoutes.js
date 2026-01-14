import express from "express";
<<<<<<< HEAD
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 Mock categories (فعلاً)
const categories = [
  { id: 1, name: "نقاشی" },
  { id: 2, name: "طراحی" },
  { id: 3, name: "خوشنویسی" },
];

// 📌 Public routes
router.get("/", (req, res) => {
  res.json(categories); // ✅ آرایه
});

router.get("/:id", (req, res) => {
  const category = categories.find((c) => c.id === Number(req.params.id));

  if (!category) {
    return res.status(404).json({ message: "کتگوری پیدا نشد" });
  }

  res.json(category);
});

// 📌 Protected routes
router.post("/", authMiddleware, (req, res) => {
  const newCategory = {
    id: categories.length + 1,
    name: req.body.name,
  };

  categories.push(newCategory);
  res.status(201).json(newCategory);
});

router.put("/:id", authMiddleware, (req, res) => {
  const category = categories.find((c) => c.id === Number(req.params.id));

  if (!category) {
    return res.status(404).json({ message: "کتگوری پیدا نشد" });
  }

  category.name = req.body.name;
  res.json(category);
});

router.delete("/:id", authMiddleware, (req, res) => {
  const index = categories.findIndex((c) => c.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: "کتگوری پیدا نشد" });
  }

  categories.splice(index, 1);
  res.json({ message: "کتگوری حذف شد" });
});

export default router;
=======
import { createCategory, createSubCategory, getAllCategories } from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", createCategory);      // ساخت دسته
router.post("/sub", createSubCategory); // ساخت زیرمجموعه
router.get("/", getAllCategories);     // دریافت همه

export default router;
>>>>>>> 60a9529111f64be2f16df52616230fce18e1cb9c
