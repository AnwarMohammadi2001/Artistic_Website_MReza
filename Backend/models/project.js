import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Project = sequelize.define("Project", {
  title: { type: DataTypes.STRING, allowNull: false }, // اجباری

  // بقیه فیلدها اختیاری شدند (allowNull: true)
  description: { type: DataTypes.TEXT, allowNull: true },
  fullDescription: { type: DataTypes.TEXT, allowNull: true },
  technique: { type: DataTypes.STRING, allowNull: true },
  size: { type: DataTypes.STRING, allowNull: true },
  location: { type: DataTypes.STRING, allowNull: true },
  organizer: { type: DataTypes.STRING, allowNull: true },
  exhibitionName: { type: DataTypes.STRING, allowNull: true },
  date: { type: DataTypes.STRING, allowNull: true },
  duration: { type: DataTypes.STRING, allowNull: true },
  link: { type: DataTypes.STRING, allowNull: true },

  mediaType: {
    type: DataTypes.ENUM("image", "video"),
    defaultValue: "image",
  },
  mainImage: { type: DataTypes.STRING, allowNull: true }, // شاید بخواهید بعدا عکس اضافه کنید
});

export default Project;