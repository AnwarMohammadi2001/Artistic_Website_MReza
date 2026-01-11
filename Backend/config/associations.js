// config/associations.js
import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";
import FieldDefinition from "../models/FieldDefinition.js";
import Item from "../models/Item.js";
import Media from "../models/Media.js";
import User from "../models/User.js";

const setupAssociations = () => {
  // Category ↔ SubCategory
  Category.hasMany(SubCategory, {
    foreignKey: "categoryId",
    onDelete: "CASCADE",
  });
  SubCategory.belongsTo(Category, { foreignKey: "categoryId" });

  // Category ↔ FieldDefinition
  Category.hasMany(FieldDefinition, {
    foreignKey: "targetId",
    constraints: false,
    scope: {
      targetType: "category",
    },
  });

  // SubCategory ↔ FieldDefinition
  SubCategory.hasMany(FieldDefinition, {
    foreignKey: "targetId",
    constraints: false,
    scope: {
      targetType: "subcategory",
    },
  });

  // Item ↔ Category/SubCategory
  Item.belongsTo(Category, { foreignKey: "categoryId" });
  Item.belongsTo(SubCategory, { foreignKey: "subCategoryId" });
  Category.hasMany(Item, { foreignKey: "categoryId" });
  SubCategory.hasMany(Item, { foreignKey: "subCategoryId" });

  // Item ↔ Media (تصاویر و فایل‌ها)
  Item.hasMany(Media, { foreignKey: "itemId", onDelete: "CASCADE" });
  Media.belongsTo(Item, { foreignKey: "itemId" });

  // Item ↔ User
  Item.belongsTo(User, { foreignKey: "createdBy" });
  User.hasMany(Item, { foreignKey: "createdBy" });
};

export default setupAssociations;
