import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Project = sequelize.define("Project", {
  title: { type: DataTypes.STRING, allowNull: false }, // عنوان
  description: { type: DataTypes.TEXT }, // توضیحات کوتاه
  fullDescription: { type: DataTypes.TEXT }, // توضیحات کامل
  
  technique: { type: DataTypes.STRING }, // تکنیک
  size: { type: DataTypes.STRING }, // سایز
  location: { type: DataTypes.STRING }, // مکان
  organizer: { type: DataTypes.STRING }, // برگزار کننده
  exhibitionName: { type: DataTypes.STRING }, // نام نمایشگاه
  
  date: { type: DataTypes.STRING }, // تاریخ
  duration: { type: DataTypes.STRING }, // مدت زمان
  link: { type: DataTypes.STRING }, // لینک خارجی
  
  mediaType: { 
    type: DataTypes.ENUM("image", "video"), 
    defaultValue: "image" 
  },
  mainImage: { type: DataTypes.STRING }, // مسیر فایل آپلود شده
});

export default Project;