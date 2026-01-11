import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 Public routes
router.get("/", (req, res) => {
  const { category, subcategory, page = 1, limit = 20, search } = req.query;
  res.json({
    message: "GET /api/items - دریافت همه آیتم‌ها",
    query: { category, subcategory, page, limit, search },
  });
});

router.get("/category/:categoryId", (req, res) => {
  res.json({
    message: `GET /api/items/category/${req.params.categoryId} - دریافت آیتم‌های یک کتگوری`,
  });
});

router.get("/subcategory/:subCategoryId", (req, res) => {
  res.json({
    message: `GET /api/items/subcategory/${req.params.subCategoryId} - دریافت آیتم‌های یک ساب‌کتگوری`,
  });
});

router.get("/:id", (req, res) => {
  res.json({
    message: `GET /api/items/${req.params.id} - دریافت یک آیتم`,
  });
});

router.get("/slug/:slug", (req, res) => {
  res.json({
    message: `GET /api/items/slug/${req.params.slug} - دریافت آیتم بر اساس slug`,
  });
});

// 📌 Protected routes
router.post("/", authMiddleware, (req, res) => {
  res.json({
    message: "POST /api/items - ایجاد آیتم جدید",
    body: req.body,
    files: req.files,
  });
});

router.put("/:id", authMiddleware, (req, res) => {
  res.json({
    message: `PUT /api/items/${req.params.id} - به‌روزرسانی آیتم`,
    body: req.body,
  });
});

router.delete("/:id", authMiddleware, (req, res) => {
  res.json({
    message: `DELETE /api/items/${req.params.id} - حذف آیتم`,
  });
});

// 📌 مدیریت تصاویر اضافی
router.post("/:id/media", authMiddleware, (req, res) => {
  res.json({
    message: `POST /api/items/${req.params.id}/media - افزودن تصویر به آیتم`,
    body: req.body,
    files: req.files,
  });
});

router.delete("/media/:mediaId", authMiddleware, (req, res) => {
  res.json({
    message: `DELETE /api/items/media/${req.params.mediaId} - حذف تصویر از آیتم`,
  });
});

export default router;
