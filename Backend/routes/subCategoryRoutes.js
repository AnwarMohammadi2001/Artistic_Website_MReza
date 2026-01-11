import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 Public routes
router.get("/category/:categoryId", (req, res) => {
  res.json({
    message: `GET /api/subcategories/category/${req.params.categoryId} - دریافت ساب‌کتگوری‌های یک کتگوری`,
  });
});

router.get("/:id", (req, res) => {
  res.json({
    message: `GET /api/subcategories/${req.params.id} - دریافت یک ساب‌کتگوری`,
  });
});

// 📌 Protected routes
router.post("/", authMiddleware, (req, res) => {
  res.json({
    message: "POST /api/subcategories - ایجاد ساب‌کتگوری جدید",
    body: req.body,
  });
});

router.put("/:id", authMiddleware, (req, res) => {
  res.json({
    message: `PUT /api/subcategories/${req.params.id} - به‌روزرسانی ساب‌کتگوری`,
    body: req.body,
  });
});

router.delete("/:id", authMiddleware, (req, res) => {
  res.json({
    message: `DELETE /api/subcategories/${req.params.id} - حذف ساب‌کتگوری`,
  });
});

// 📌 مدیریت فیلدهای داینامیک
router.post("/:id/fields", authMiddleware, (req, res) => {
  res.json({
    message: `POST /api/subcategories/${req.params.id}/fields - افزودن فیلد به ساب‌کتگوری`,
    body: req.body,
  });
});

router.get("/:id/fields", (req, res) => {
  res.json({
    message: `GET /api/subcategories/${req.params.id}/fields - دریافت فیلدهای ساب‌کتگوری`,
  });
});

export default router;
