// server.js — به‌روزرسانی نهایی
import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import sequelize from "./config/db.js";
import fs from "fs";

// Routes
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subCategoryRoutes from "./routes/subCategoryRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import setupAssociations from "./config/associations.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Allowed origins
const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];

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

// ✅ Handle CORS errors
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
setupAssociations();
// ✅ ایجاد پوشه uploads
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ✅ Serve static files
app.use("/uploads", express.static(uploadsDir));

// ✅ Test route
app.get("/", (req, res) => {
  res.json({
    message: "🚀 TET Backend API is running successfully...",
    endpoints: {
      categories: "/api/categories",
      subcategories: "/api/subcategories",
      items: "/api/items",
      auth: "/api/auth",
    },
  });
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/items", itemRoutes);

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    requestedUrl: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      "GET    /api/categories",
      "POST   /api/categories",
      "GET    /api/categories/:id",
      "GET    /api/categories/:id/subcategories",
      "POST   /api/categories/:id/fields",
      "GET    /api/subcategories",
      "POST   /api/subcategories",
      "GET    /api/subcategories/category/:categoryId",
      "GET    /api/subcategories/:id",
      "GET    /api/items",
      "POST   /api/items",
      "GET    /api/items/category/:categoryId",
      "GET    /api/items/subcategory/:subCategoryId",
    ],
  });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ✅ Start Server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected via Sequelize!");

    // فقط در حالت توسعه تیبل‌ها رو سینک کن
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("✅ Database tables synced successfully");
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📝 API Base URL: http://localhost:${PORT}`);
      console.log(`🔗 Categories: http://localhost:${PORT}/api/categories`);
      console.log(`🔗 Test: http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
