// models/FieldDefinition.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const FieldDefinition = sequelize.define(
  "FieldDefinition",
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
    label: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        "text",
        "number",
        "textarea",
        "date",
        "image",
        "color",
        "file",
        "select"
      ),
      allowNull: false,
    },
    required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    options: {
      type: DataTypes.JSON, // برای select field
      defaultValue: [],
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    targetType: {
      type: DataTypes.ENUM("category", "subcategory"),
      allowNull: false,
    },
    targetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default FieldDefinition;
