import multer from "multer";
import path from "path";
import fs from "fs";

// اطمینان از وجود پوشه آپلود
const uploadDir = "uploads/projects";
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // نام یکتا برای فایل: timestamp-filename
    cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`);
  },
});

const fileFilter = (req, file, cb) => {
  // اجازه آپلود عکس و ویدیو
  if (
    file.mimetype.startsWith("image/") || 
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed!"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // محدودیت 50 مگابایت
  fileFilter,
});

export default upload;