import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const SubCategory = sequelize.define("SubCategory", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default SubCategory;