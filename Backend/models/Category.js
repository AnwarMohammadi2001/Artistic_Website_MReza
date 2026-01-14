import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Category = sequelize.define("Category", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Category;
