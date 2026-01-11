import Item from "../models/Item.js";
import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";
import FieldDefinition from "../models/FieldDefinition.js";
import Media from "../models/Media.js";
import { Op } from "sequelize";
import slugify from "slugify";
import path from "path";
import fs from "fs";

export default {
  // 📌 ایجاد آیتم جدید
  async createItem(req, res) {
    try {
      const {
        title,
        description,
        categoryId,
        subCategoryId,
        customFields = {},
      } = req.body;

      const userId = req.user.id;

      // بررسی وجود کتگوری و ساب‌کتگوری
      const category = await Category.findByPk(categoryId);
      const subCategory = await SubCategory.findOne({
        where: {
          id: subCategoryId,
          categoryId,
        },
      });

      if (!category || !subCategory) {
        return res.status(400).json({
          message: "کتگوری یا ساب‌کتگوری نامعتبر است",
        });
      }

      // دریافت فیلدهای اجباری
      const requiredFields = await FieldDefinition.findAll({
        where: {
          [Op.or]: [
            { targetType: "category", targetId: categoryId, required: true },
            {
              targetType: "subcategory",
              targetId: subCategoryId,
              required: true,
            },
          ],
        },
      });

      // اعتبارسنجی فیلدهای اجباری
      for (const field of requiredFields) {
        if (
          !customFields[field.name] ||
          customFields[field.name].toString().trim() === ""
        ) {
          return res.status(400).json({
            message: `فیلد "${field.label}" اجباری است`,
          });
        }
      }

      // ایجاد slug
      const slug =
        slugify(title, { lower: true, strict: true }) + "-" + Date.now();

      // ایجاد آیتم
      const item = await Item.create({
        title,
        slug,
        description,
        categoryId,
        subCategoryId,
        customFields,
        createdBy: userId,
        status: "published",
      });

      // 📌 مدیریت فایل‌های آپلود شده
      if (req.files) {
        const mediaPromises = [];

        // تصویر اصلی
        if (req.files.featuredImage && req.files.featuredImage[0]) {
          const file = req.files.featuredImage[0];
          await Media.create({
            filename: file.filename,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: `/uploads/${file.filename}`,
            itemId: item.id,
            fieldName: "featuredImage",
            isFeatured: true,
          });
        }

        // تصاویر اضافی
        if (req.files.additionalImages) {
          for (let i = 0; i < req.files.additionalImages.length; i++) {
            const file = req.files.additionalImages[i];
            await Media.create({
              filename: file.filename,
              originalname: file.originalname,
              mimetype: file.mimetype,
              size: file.size,
              path: `/uploads/${file.filename}`,
              itemId: item.id,
              fieldName: "gallery",
              order: i,
            });
          }
        }
      }

      // دریافت آیتم کامل با اطلاعات مرتبط
      const createdItem = await Item.findByPk(item.id, {
        include: [
          {
            model: Category,
            attributes: ["id", "name", "slug"],
          },
          {
            model: SubCategory,
            attributes: ["id", "name", "slug"],
          },
          {
            model: Media,
            attributes: ["id", "path", "fieldName", "order", "isFeatured"],
            order: [
              ["isFeatured", "DESC"],
              ["order", "ASC"],
            ],
          },
        ],
      });

      res.status(201).json({
        message: "آیتم با موفقیت ایجاد شد",
        item: createdItem,
      });
    } catch (error) {
      console.error("Error creating item:", error);
      res
        .status(500)
        .json({ message: "خطا در ایجاد آیتم", error: error.message });
    }
  },

  // 📌 دریافت همه آیتم‌ها
  async getAllItems(req, res) {
    try {
      const { page = 1, limit = 20, category, subcategory, search } = req.query;

      const offset = (page - 1) * limit;
      const where = { status: "published" };

      if (category) where.categoryId = category;
      if (subcategory) where.subCategoryId = subcategory;

      if (search) {
        where[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ];
      }

      const { rows: items, count } = await Item.findAndCountAll({
        where,
        include: [
          {
            model: Category,
            attributes: ["id", "name", "slug"],
          },
          {
            model: SubCategory,
            attributes: ["id", "name", "slug"],
          },
          {
            model: Media,
            where: { isFeatured: true },
            required: false,
            attributes: ["id", "path"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      res.json({
        items,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit),
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "خطا در دریافت آیتم‌ها", error: error.message });
    }
  },

  // 📌 دریافت آیتم‌های یک کتگوری
  async getItemsByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      const { rows: items, count } = await Item.findAndCountAll({
        where: {
          categoryId,
          status: "published",
        },
        include: [
          {
            model: SubCategory,
            attributes: ["id", "name", "slug"],
          },
          {
            model: Media,
            where: { isFeatured: true },
            required: false,
            attributes: ["id", "path"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      res.json({
        items,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit),
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "خطا در دریافت آیتم‌ها", error: error.message });
    }
  },

  // 📌 دریافت آیتم‌های یک ساب‌کتگوری
  async getItemsBySubCategory(req, res) {
    try {
      const { subCategoryId } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      const { rows: items, count } = await Item.findAndCountAll({
        where: {
          subCategoryId,
          status: "published",
        },
        include: [
          {
            model: Category,
            attributes: ["id", "name", "slug"],
          },
          {
            model: SubCategory,
            attributes: ["id", "name", "slug"],
          },
          {
            model: Media,
            attributes: ["id", "path", "fieldName", "order", "isFeatured"],
            order: [
              ["isFeatured", "DESC"],
              ["order", "ASC"],
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      res.json({
        items,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit),
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "خطا در دریافت آیتم‌ها", error: error.message });
    }
  },

  // 📌 دریافت یک آیتم
  async getItemById(req, res) {
    try {
      const { id } = req.params;
      const item = await Item.findByPk(id, {
        include: [
          {
            model: Category,
            attributes: ["id", "name", "slug"],
          },
          {
            model: SubCategory,
            attributes: ["id", "name", "slug"],
          },
          {
            model: Media,
            attributes: ["id", "path", "fieldName", "order", "isFeatured"],
            order: [
              ["isFeatured", "DESC"],
              ["order", "ASC"],
            ],
          },
        ],
      });

      if (!item) {
        return res.status(404).json({ message: "آیتم یافت نشد" });
      }

      res.json(item);
    } catch (error) {
      res
        .status(500)
        .json({ message: "خطا در دریافت آیتم", error: error.message });
    }
  },

  // 📌 دریافت آیتم بر اساس slug
  async getItemBySlug(req, res) {
    try {
      const { slug } = req.params;
      const item = await Item.findOne({
        where: { slug },
        include: [
          {
            model: Category,
            attributes: ["id", "name", "slug"],
          },
          {
            model: SubCategory,
            attributes: ["id", "name", "slug"],
          },
          {
            model: Media,
            attributes: ["id", "path", "fieldName", "order", "isFeatured"],
            order: [
              ["isFeatured", "DESC"],
              ["order", "ASC"],
            ],
          },
        ],
      });

      if (!item) {
        return res.status(404).json({ message: "آیتم یافت نشد" });
      }

      res.json(item);
    } catch (error) {
      res
        .status(500)
        .json({ message: "خطا در دریافت آیتم", error: error.message });
    }
  },

  // 📌 اضافه کردن تصویر به آیتم
  async addMediaToItem(req, res) {
    try {
      const { id } = req.params;
      const { fieldName } = req.body;
      const userId = req.user.id;

      const item = await Item.findByPk(id);
      if (!item) {
        return res.status(404).json({ message: "آیتم یافت نشد" });
      }

      // بررسی مالکیت
      if (item.createdBy !== userId && !req.user.isAdmin) {
        return res.status(403).json({ message: "دسترسی غیرمجاز" });
      }

      if (!req.files || !req.files.file) {
        return res.status(400).json({ message: "فایل ارسال نشده است" });
      }

      const file = req.files.file[0];
      const media = await Media.create({
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: `/uploads/${file.filename}`,
        itemId: id,
        fieldName: fieldName || "gallery",
      });

      res.status(201).json({
        message: "تصویر با موفقیت اضافه شد",
        media,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "خطا در اضافه کردن تصویر", error: error.message });
    }
  },

  // 📌 حذف تصویر از آیتم
  async removeMediaFromItem(req, res) {
    try {
      const { mediaId } = req.params;
      const userId = req.user.id;

      const media = await Media.findByPk(mediaId, {
        include: [Item],
      });

      if (!media) {
        return res.status(404).json({ message: "تصویر یافت نشد" });
      }

      // بررسی مالکیت
      if (media.Item.createdBy !== userId && !req.user.isAdmin) {
        return res.status(403).json({ message: "دسترسی غیرمجاز" });
      }

      // حذف فایل از سرور
      const filePath = path.join(process.cwd(), "uploads", media.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await media.destroy();

      res.json({ message: "تصویر با موفقیت حذف شد" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "خطا در حذف تصویر", error: error.message });
    }
  },

  // 📌 به‌روزرسانی آیتم
  async updateItem(req, res) {
    try {
      const { id } = req.params;
      const { title, description, customFields, status } = req.body;
      const userId = req.user.id;

      const item = await Item.findByPk(id);
      if (!item) {
        return res.status(404).json({ message: "آیتم یافت نشد" });
      }

      // بررسی مالکیت
      if (item.createdBy !== userId && !req.user.isAdmin) {
        return res.status(403).json({ message: "دسترسی غیرمجاز" });
      }

      if (title) {
        const slug =
          slugify(title, { lower: true, strict: true }) + "-" + Date.now();
        item.title = title;
        item.slug = slug;
      }
      if (description !== undefined) item.description = description;
      if (customFields)
        item.customFields = { ...item.customFields, ...customFields };
      if (status) item.status = status;

      await item.save();

      res.json({
        message: "آیتم با موفقیت به‌روزرسانی شد",
        item,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "خطا در به‌روزرسانی آیتم", error: error.message });
    }
  },

  // 📌 حذف آیتم
  async deleteItem(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const item = await Item.findByPk(id, {
        include: [Media],
      });

      if (!item) {
        return res.status(404).json({ message: "آیتم یافت نشد" });
      }

      // بررسی مالکیت
      if (item.createdBy !== userId && !req.user.isAdmin) {
        return res.status(403).json({ message: "دسترسی غیرمجاز" });
      }

      // حذف فایل‌های مرتبط
      for (const media of item.Media) {
        const filePath = path.join(process.cwd(), "uploads", media.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        await media.destroy();
      }

      await item.destroy();

      res.json({ message: "آیتم با موفقیت حذف شد" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "خطا در حذف آیتم", error: error.message });
    }
  },
};
