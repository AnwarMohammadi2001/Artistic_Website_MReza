// middleware/authMiddleware.js - نسخه موقت برای تست
const authMiddleware = (req, res, next) => {
  // برای تست، اجازه می‌دهیم همه درخواست‌ها عبور کنند
  console.log("Auth middleware called for:", req.method, req.path);

  // شبیه‌سازی کاربر لاگین کرده
  req.user = {
    id: 1,
    email: "test@example.com",
    isAdmin: true,
  };

  next();
};

export default authMiddleware;
