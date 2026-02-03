import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";

/* ===================== CATEGORY ===================== */

// ➕ Create Category
export const createCategory = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const category = await Category.create({ title });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📥 Get All Categories (with subcategories)
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: SubCategory }],
      order: [["id", "DESC"]],
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📥 Get Single Category
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: SubCategory }],
    });

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update Category
export const updateCategory = async (req, res) => {
  try {
    const { title } = req.body;

    const category = await Category.findByPk(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    category.title = title ?? category.title;
    await category.save();

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Delete Category (with subcategories)
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    await SubCategory.destroy({ where: { CategoryId: category.id } });
    await category.destroy();

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===================== SUB CATEGORY ===================== */

// ➕ Create SubCategory
export const createSubCategory = async (req, res) => {
  try {
    const { title, categoryId } = req.body;
    if (!title || !categoryId)
      return res.status(400).json({ message: "Title and CategoryID required" });

    const sub = await SubCategory.create({
      title,
      CategoryId: categoryId,
    });

    res.status(201).json(sub);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📥 Get All SubCategories
export const getAllSubCategories = async (req, res) => {
  try {
    const subs = await SubCategory.findAll({
      include: [{ model: Category }],
      order: [["id", "DESC"]],
    });
    res.json(subs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📥 Get SubCategory By ID
export const getSubCategoryById = async (req, res) => {
  try {
    const sub = await SubCategory.findByPk(req.params.id, {
      include: [{ model: Category }],
    });

    if (!sub) return res.status(404).json({ message: "SubCategory not found" });

    res.json(sub);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update SubCategory
export const updateSubCategory = async (req, res) => {
  try {
    const { title, categoryId } = req.body;

    const sub = await SubCategory.findByPk(req.params.id);
    if (!sub) return res.status(404).json({ message: "SubCategory not found" });

    sub.title = title ?? sub.title;
    sub.CategoryId = categoryId ?? sub.CategoryId;

    await sub.save();
    res.json(sub);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Delete SubCategory
export const deleteSubCategory = async (req, res) => {
  try {
    const sub = await SubCategory.findByPk(req.params.id);
    if (!sub) return res.status(404).json({ message: "SubCategory not found" });

    await sub.destroy();
    res.json({ message: "SubCategory deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
