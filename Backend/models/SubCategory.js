import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Category from "./Category.js"; // برای reference اگر نیاز باشه

const SubCategory = sequelize.define("SubCategory", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // ⚠️ **نباید ستون categoryId دوباره تعریف شود**
  // Sequelize با belongsTo خودش اضافه می‌کنه
});

export default SubCategory;
