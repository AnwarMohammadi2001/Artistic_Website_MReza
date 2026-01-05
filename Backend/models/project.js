import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Project = sequelize.define(
  "project",
  {
    title: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: false },
    liveUrl: { type: DataTypes.STRING, allowNull: true },
  },
  { timestamps: true }
);

export default Project;
