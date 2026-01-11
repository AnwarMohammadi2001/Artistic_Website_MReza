// models/Media.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Media = sequelize.define(
  "Media",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    filename: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    originalname: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    mimetype: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
    },
    path: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fieldName: {
      type: DataTypes.STRING(100),
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default Media;
