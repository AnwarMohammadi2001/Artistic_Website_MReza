// server.js — Final Production Version
import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import sequelize from "./config/db.js";

// ✅ Import Models (نام فایل‌ها دقیق باشد)
import Project from "./models/Project.js";
import Category from "./models/Category.js";
import SubCategory from "./models/SubCategory.js";

// ✅ Import Routes
import authRoutes from "./routes/authRoutes.js";

import projectRoutes from "./routes/projectRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Allowed origins
const allowedOrigins = [
  "https://tet-soft.com",
  "http://localhost:3000",
  "http://localhost:5173",
  "https://backend.tet-soft.com",
];

// ✅ Configure CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: Access denied from ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((err, req, res, next) => {
  if (err.message && err.message.includes("CORS")) {
    return res.status(403).json({ message: err.message });
  }
  next(err);
});

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// ✅ Serve static files
const uploadsDir = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsDir));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🚀 TET Backend is running successfully...");
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/contact", emailRoutes);

// ✅ 404 Handler (این را اضافه کنید تا بفهمیم چه آدرسی اشتباه است)
app.use((req, res, next) => {
  res.status(404).json({
    message: "Route not found",
    requestedUrl: req.originalUrl, // آدرس درخواستی شما را نشان می‌دهد
    method: req.method, // متد درخواست (GET, POST)
  });
});
// ✅ Define Database Relationships
const setupAssociations = () => {
  // Category <-> SubCategory
  Category.hasMany(SubCategory, { onDelete: "CASCADE" });
  SubCategory.belongsTo(Category);

  // Category <-> Project
  Category.hasMany(Project, { onDelete: "CASCADE" });
  Project.belongsTo(Category);

  // SubCategory <-> Project
  SubCategory.hasMany(Project, { onDelete: "SET NULL" });
  Project.belongsTo(SubCategory);

  console.log("✅ Database associations established.");
};

// ✅ Start Server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected via Sequelize!");

    // اجرای روابط قبل از سینک
    setupAssociations();

    // سینک کردن جداول (alter: true تغییرات جدید را بدون حذف داده‌ها اعمال می‌کند)
    await sequelize.sync({ alter: true });
    console.log("✅ Database tables synced successfully");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
