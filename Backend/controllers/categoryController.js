import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";

// ساخت دسته اصلی
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

// ساخت زیرمجموعه
export const createSubCategory = async (req, res) => {
  try {
    const { title, categoryId } = req.body;
    if (!title || !categoryId) return res.status(400).json({ message: "Title and CategoryID required" });

    const sub = await SubCategory.create({ 
      title, 
      CategoryId: categoryId 
    });
    res.status(201).json(sub);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// دریافت لیست کامل
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: SubCategory }] // همراه با زیرمجموعه‌ها بیاورد
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
