import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// پیکربندی ذخیره‌سازی
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// فیلتر فایل‌ها
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|mp4|avi|mov/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("فایل مجاز نیست! فقط تصاویر، PDF و ویدیوها مجاز هستند."));
  }
};

// آپلودر
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

// Middleware برای آپلود چند فایل
export const uploadFields = upload.fields([
  { name: "featuredImage", maxCount: 1 },
  { name: "additionalImages", maxCount: 10 },
]);

// Middleware برای آپلود تک فایل
export const uploadSingle = upload.single("file");
