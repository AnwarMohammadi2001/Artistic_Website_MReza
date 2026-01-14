import axios from "axios";

// ✅ اگر روی لوکال هستید، این آدرس استفاده می‌شود
// برای پروداکشن، خودکار آدرس دوم را می‌گیرد (اگر Env ست شده باشد)
const BASE_URL = "http://localhost:5000/api"; 
// یا اگر می‌خواهید دستی تغییر دهید:
// const BASE_URL = "https://backend.tet-soft.com/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // برای کوکی‌ها و سشن‌ها
});

export default axiosInstance;