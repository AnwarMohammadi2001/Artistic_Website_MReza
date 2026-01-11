import SubCategory from "../models/SubCategory.js";
import Category from "../models/Category.js";
import FieldDefinition from "../models/FieldDefinition.js";
import slugify from "slugify";

export default {
  // 📌 ایجاد ساب‌کتگوری جدید
  async createSubCategory(req, res) {
    try {
      const { name, description, categoryId } = req.body;
      const userId = req.user.id;

      // بررسی وجود کتگوری
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: "کتگوری یافت نشد" });
      }

      // بررسی وجود ساب‌کتگوری با همین نام در این کتگوری
      const existingSubCategory = await SubCategory.findOne({
        where: {
          name,
          categoryId,
        },
      });

      if (existingSubCategory) {
        return res
          .status(400)
          .json({ message: "ساب‌کتگوری با این نام وجود دارد" });
      }

      // ایجاد slug
      const slug = slugify(`${category.name}-${name}`, {
        lower: true,
        strict: true,
      });

      const subCategory = await SubCategory.create({
        name,
        slug,
        description,
        categoryId,
        createdBy: userId,
      });

      res.status(201).json({
        message: "ساب‌کتگوری با موفقیت ایجاد شد",
        subCategory: {
          ...subCategory.toJSON(),
          Category: category,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "خطا در ایجاد ساب‌کتگوری", error: error.message });
    }
  },

  // 📌 دریافت ساب‌کتگوری‌های یک کتگوری
  async getSubCategoriesByCategory(req, res) {
    try {
      const { categoryId } = req.params;

      const subcategories = await SubCategory.findAll({
        where: { categoryId },
        include: [
          {
            model: Category,
            attributes: ["id", "name", "slug"],
          },
          {
            model: FieldDefinition,
            where: { targetType: "subcategory" },
            required: false,
            order: [["order", "ASC"]],
          },
        ],
        order: [["name", "ASC"]],
      });

      // محاسبه تعداد آیتم‌ها برای هر ساب‌کتگوری
      const subcategoriesWithStats = await Promise.all(
        subcategories.map(async (subCategory) => {
          const itemCount = await subCategory.countItems();
          return {
            ...subCategory.toJSON(),
            itemCount,
          };
        })
      );

      res.json(subcategoriesWithStats);
    } catch (error) {
      res
        .status(500)
        .json({ message: "خطا در دریافت ساب‌کتگوری‌ها", error: error.message });
    }
  },

  // 📌 دریافت یک ساب‌کتگوری
  async getSubCategoryById(req, res) {
    try {
      const { id } = req.params;
      const subCategory = await SubCategory.findByPk(id, {
        include: [
          {
            model: Category,
            attributes: ["id", "name", "slug"],
          },
          {
            model: FieldDefinition,
            where: { targetType: "subcategory" },
            required: false,
            order: [["order", "ASC"]],
          },
        ],
      });

      if (!subCategory) {
        return res.status(404).json({ message: "ساب‌کتگوری یافت نشد" });
      }

      // دریافت فیلدهای کتگوری والد
      const parentFields = await FieldDefinition.findAll({
        where: {
          targetType: "category",
          targetId: subCategory.categoryId,
        },
        order: [["order", "ASC"]],
      });

      res.json({
        ...subCategory.toJSON(),
        parentFields,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "خطا در دریافت ساب‌کتگوری", error: error.message });
    }
  },

  // 📌 اضافه کردن فیلد به ساب‌کتگوری
  async addFieldToSubCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, label, type, required, options, order } = req.body;
      const userId = req.user.id;

      // بررسی وجود ساب‌کتگوری
      const subCategory = await SubCategory.findByPk(id);
      if (!subCategory) {
        return res.status(404).json({ message: "ساب‌کتگوری یافت نشد" });
      }

      // بررسی وجود فیلد با همین نام
      const existingField = await FieldDefinition.findOne({
        where: {
          name,
          targetType: "subcategory",
          targetId: id,
        },
      });

      if (existingField) {
        return res.status(400).json({ message: "فیلد با این نام وجود دارد" });
      }

      const field = await FieldDefinition.create({
        name,
        label,
        type,
        required: required || false,
        options: options || [],
        order: order || 0,
        targetType: "subcategory",
        targetId: id,
        createdBy: userId,
      });

      res.status(201).json({
        message: "فیلد با موفقیت اضافه شد",
        field,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "خطا در اضافه کردن فیلد", error: error.message });
    }
  },

  // 📌 دریافت فیلدهای ساب‌کتگوری
  async getSubCategoryFields(req, res) {
    try {
      const { id } = req.params;

      const subCategory = await SubCategory.findByPk(id);
      if (!subCategory) {
        return res.status(404).json({ message: "ساب‌کتگوری یافت نشد" });
      }

      // دریافت فیلدهای ساب‌کتگوری
      const subCategoryFields = await FieldDefinition.findAll({
        where: {
          targetType: "subcategory",
          targetId: id,
        },
        order: [["order", "ASC"]],
      });

      // دریافت فیلدهای کتگوری والد
      const parentFields = await FieldDefinition.findAll({
        where: {
          targetType: "category",
          targetId: subCategory.categoryId,
        },
        order: [["order", "ASC"]],
      });

      res.json({
        subCategoryFields,
        parentFields,
        allFields: [...parentFields, ...subCategoryFields],
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "خطا در دریافت فیلدها", error: error.message });
    }
  },

  // 📌 به‌روزرسانی ساب‌کتگوری
  async updateSubCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const subCategory = await SubCategory.findByPk(id, {
        include: [Category],
      });

      if (!subCategory) {
        return res.status(404).json({ message: "ساب‌کتگوری یافت نشد" });
      }

      if (name) {
        const slug = slugify(`${subCategory.Category.name}-${name}`, {
          lower: true,
          strict: true,
        });
        subCategory.name = name;
        subCategory.slug = slug;
      }
      if (description !== undefined) subCategory.description = description;

      await subCategory.save();

      res.json({
        message: "ساب‌کتگوری با موفقیت به‌روزرسانی شد",
        subCategory,
      });
    } catch (error) {
      res
        .status(500)
        .json({
          message: "خطا در به‌روزرسانی ساب‌کتگوری",
          error: error.message,
        });
    }
  },

  // 📌 حذف ساب‌کتگوری
  async deleteSubCategory(req, res) {
    try {
      const { id } = req.params;

      const subCategory = await SubCategory.findByPk(id);
      if (!subCategory) {
        return res.status(404).json({ message: "ساب‌کتگوری یافت نشد" });
      }

      // بررسی اینکه ساب‌کتگوری خالی باشد
      const itemCount = await subCategory.countItems();
      if (itemCount > 0) {
        return res.status(400).json({
          message: "امکان حذف ساب‌کتگوری با آیتم‌های فعال وجود ندارد",
        });
      }

      // حذف فیلدهای مرتبط
      await FieldDefinition.destroy({
        where: {
          targetType: "subcategory",
          targetId: id,
        },
      });

      await subCategory.destroy();

      res.json({ message: "ساب‌کتگوری با موفقیت حذف شد" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "خطا در حذف ساب‌کتگوری", error: error.message });
    }
  },
};
