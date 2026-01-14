import Project from "../models/Project.js";
import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";

// افزودن پروژه جدید
export const addProject = async (req, res) => {
  try {
    // اطلاعات متنی از فرم
    const {
      title, description, fullDescription, technique, size,
      location, organizer, exhibitionName, date, duration,
      link, categoryId, subCategoryId, mediaType
    } = req.body;

    // مسیر فایل آپلود شده
    const mainImage = req.file ? `/uploads/projects/${req.file.filename}` : null;

    // هندل کردن subCategoryId اگر خالی ارسال شد
    const validSubId = (subCategoryId && subCategoryId !== "null" && subCategoryId !== "") 
                        ? subCategoryId 
                        : null;

    const newProject = await Project.create({
      title, description, fullDescription, technique, size,
      location, organizer, exhibitionName, date, duration,
      link, mediaType, mainImage,
      CategoryId: categoryId,
      SubCategoryId: validSubId
    });

    res.status(201).json({ message: "Project created!", project: newProject });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// دریافت همه پروژه‌ها (با قابلیت فیلتر)
export const getProjects = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const whereClause = {};
    
    if (categoryId) {
      whereClause.CategoryId = categoryId;
    }

    const projects = await Project.findAll({
      where: whereClause,
      include: [
        { model: Category, attributes: ['title'] },
        { model: SubCategory, attributes: ['title'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// حذف پروژه
export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await Project.destroy({ where: { id } });
        res.json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};