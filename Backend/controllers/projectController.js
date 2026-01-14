import Project from "../models/Project.js";
import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";
import sharp from "sharp"; // ✅ ایمپورت شارپ
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// تنظیم مسیرها
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// اطمینان از وجود پوشه آپلود
const uploadDir = path.join(__dirname, "../uploads/projects");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const addProject = async (req, res) => {
  try {
    const {
      title,
      description,
      fullDescription,
      technique,
      size,
      location,
      organizer,
      exhibitionName,
      date,
      duration,
      link,
      categoryId,
      subCategoryId,
      mediaType,
    } = req.body;

    let mainImageUrl = "";

    // ✅ پردازش فایل با Sharp
    if (req.file) {
      // تولید نام یکتا
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

      if (req.file.mimetype.startsWith("image")) {
        // --- پردازش تصویر ---
        const filename = `img-${uniqueSuffix}.webp`; // فرمت نهایی WebP
        const filepath = path.join(uploadDir, filename);

        await sharp(req.file.buffer)
          .resize(1200) // عرض تصویر حداکثر 1200 پیکسل شود (ارتفاع اتوماتیک)
          .webp({ quality: 80 }) // تبدیل به WebP با کیفیت 80%
          .toFile(filepath);

        mainImageUrl = `/uploads/projects/${filename}`;
      } else {
        // --- پردازش ویدیو ---
        // شارپ ویدیو را تغییر نمی‌دهد، پس مستقیم ذخیره می‌کنیم
        const ext = path.extname(req.file.originalname);
        const filename = `vid-${uniqueSuffix}${ext}`;
        const filepath = path.join(uploadDir, filename);

        fs.writeFileSync(filepath, req.file.buffer);
        mainImageUrl = `/uploads/projects/${filename}`;
      }
    }

    // هندل کردن subCategoryId
    const validSubId =
      subCategoryId && subCategoryId !== "null" && subCategoryId !== ""
        ? subCategoryId
        : null;

    // ذخیره در دیتابیس
    const newProject = await Project.create({
      title,
      description,
      fullDescription,
      technique,
      size,
      location,
      organizer,
      exhibitionName,
      date,
      duration,
      link,
      mediaType,
      mainImage: mainImageUrl, // آدرس فایل بهینه شده
      CategoryId: categoryId,
      SubCategoryId: validSubId,
    });

    res
      .status(201)
      .json({ message: "Project created successfully!", project: newProject });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// دریافت پروژه‌ها (بدون تغییر)
export const getProjects = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const whereClause = {};

    if (categoryId) whereClause.CategoryId = categoryId;

    const projects = await Project.findAll({
      where: whereClause,
      include: [
        { model: Category, attributes: ["title"] },
        { model: SubCategory, attributes: ["title"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// حذف پروژه (همراه با حذف فایل از پوشه)
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. پیدا کردن پروژه برای گرفتن نام فایل
    const project = await Project.findOne({ where: { id } });
    if (!project) return res.status(404).json({ message: "Project not found" });

    // 2. حذف فایل از پوشه uploads
    if (project.mainImage) {
      // mainImage به صورت /uploads/projects/filename است
      // ما باید مسیر کامل سیستم را بسازیم
      const fileName = path.basename(project.mainImage);
      const filePath = path.join(uploadDir, fileName);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // حذف فایل فیزیکی
      }
    }

    // 3. حذف از دیتابیس
    await Project.destroy({ where: { id } });

    res.json({ message: "Project and file deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
