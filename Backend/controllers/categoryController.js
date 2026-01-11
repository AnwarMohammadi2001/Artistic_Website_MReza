import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";
import FieldDefinition from "../models/FieldDefinition.js";
import slugify from "slugify";

export default {
  // 📌 ایجاد کتگوری جدید
  async createCategory(req, res) {
    try {
      const { name, description, icon } = req.body;
      const userId = req.user.id;

      // بررسی وجود کتگوری با همین نام
      const existingCategory = await Category.findOne({ where: { name } });
      if (existingCategory) {
        return res.status(400).json({ message: "کتگوری با این نام وجود دارد" });
      }

      // ایجاد slug
      const slug = slugify(name, { lower: true, strict: true });

      const category = await Category.create({
        name,
        slug,
        description,
        icon,
        createdBy: userId,
      });

      res.status(201).json({
        message: "کتگوری با موفقیت ایجاد شد",
        category,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "خطا در ایجاد کتگوری", error: error.message });
    }
  },

  // 📌 دریافت همه کتگوری‌ها
  async getAllCategories(req, res) {
    try {
      const categories = await Category.findAll({
        include: [
          {
            model: SubCategory,
            attributes: ["id", "name", "slug", "itemCount"],
            order: [["name", "ASC"]],
          },
        ],
        order: [["name", "ASC"]],
      });

      // محاسبه تعداد آیتم‌ها برای هر کتگوری
      const categoriesWithStats = await Promise.all(
        categories.map(async (category) => {
          const itemCount = await category.countItems();
          return {
            ...category.toJSON(),
            itemCount,
          };
        })
      );

      res.json(categoriesWithStats);
    } catch (error) {
      res
        .status(500)
        .json({ message: "خطا در دریافت کتگوری‌ها", error: error.message });
    }
  },

  // 📌 دریافت یک کتگوری
  async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id, {
        include: [
          {
            model: SubCategory,
            attributes: ["id", "name", "slug", "description"],
            order: [["name", "ASC"]],
          },
          {
            model: FieldDefinition,
            where: { targetType: "category" },
            required: false,
            order: [["order", "ASC"]],
          },
        ],
      });

      if (!category) {
        return res.status(404).json({ message: "کتگوری یافت نشد" });
      }

      res.json(category);
    } catch (error) {
      res
        .status(500)
        .json({ message: "خطا در دریافت کتگوری", error: error.message });
    }
  },

  // 📌 دریافت ساب‌کتگوری‌های یک کتگوری
  async getSubCategoriesByCategory(req, res) {
    try {
      const { id } = req.params;
      const subcategories = await SubCategory.findAll({
        where: { categoryId: id },
        include: [
          {
            model: FieldDefinition,
            where: { targetType: "subcategory" },
            required: false,
            order: [["order", "ASC"]],
          },
        ],
        order: [["name", "ASC"]],
      });

      res.json(subcategories);
    } catch (error) {
      res
        .status(500)
        .json({ message: "خطا در دریافت ساب‌کتگوری‌ها", error: error.message });
    }
  },

  // 📌 اضافه کردن فیلد به کتگوری
  async addFieldToCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, label, type, required, options, order } = req.body;
      const userId = req.user.id;

      // بررسی وجود کتگوری
      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: "کتگوری یافت نشد" });
      }

      // بررسی وجود فیلد با همین نام
      const existingField = await FieldDefinition.findOne({
        where: {
          name,
          targetType: "category",
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
        targetType: "category",
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

  // 📌 دریافت فیلدهای کتگوری
  async getCategoryFields(req, res) {
    try {
      const { id } = req.params;
      const fields = await FieldDefinition.findAll({
        where: {
          targetType: "category",
          targetId: id,
        },
        order: [["order", "ASC"]],
      });

      res.json(fields);
    } catch (error) {
      res
        .status(500)
        .json({ message: "خطا در دریافت فیلدها", error: error.message });
    }
  },

  // 📌 به‌روزرسانی کتگوری
  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, description, icon } = req.body;

      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: "کتگوری یافت نشد" });
      }

      if (name) {
        const slug = slugify(name, { lower: true, strict: true });
        category.name = name;
        category.slug = slug;
      }
      if (description !== undefined) category.description = description;
      if (icon !== undefined) category.icon = icon;

      await category.save();

      res.json({
        message: "کتگوری با موفقیت به‌روزرسانی شد",
        category,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "خطا در به‌روزرسانی کتگوری", error: error.message });
    }
  },

  // 📌 حذف کتگوری
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id, {
        include: [SubCategory],
      });

      if (!category) {
        return res.status(404).json({ message: "کتگوری یافت نشد" });
      }

      // بررسی اینکه کتگوری خالی باشد
      const itemCount = await category.countItems();
      if (itemCount > 0) {
        return res.status(400).json({
          message: "امکان حذف کتگوری با آیتم‌های فعال وجود ندارد",
        });
      }

      // حذف فیلدهای مرتبط
      await FieldDefinition.destroy({
        where: {
          targetType: "category",
          targetId: id,
        },
      });

      // حذف ساب‌کتگوری‌ها و فیلدهای آنها
      for (const subCategory of category.SubCategories) {
        await FieldDefinition.destroy({
          where: {
            targetType: "subcategory",
            targetId: subCategory.id,
          },
        });
        await subCategory.destroy();
      }

      await category.destroy();

      res.json({ message: "کتگوری با موفقیت حذف شد" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "خطا در حذف کتگوری", error: error.message });
    }
  },
};
