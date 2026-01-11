// models/SubCategory.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const SubCategory = sequelize.define(
  "SubCategory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Categories",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default SubCategory;
