import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance"; // ✅ ایمپورت از فایل تنظیمات
import { toast } from "react-toastify";
import { FaPlus, FaLayerGroup, FaListUl, FaTrash } from "react-icons/fa";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [catTitle, setCatTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [selectedCatId, setSelectedCatId] = useState("");
  const [loading, setLoading] = useState(false);

  // دریافت اطلاعات
  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      toast.error("خطا در دریافت دسته‌بندی‌ها");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // افزودن دسته اصلی
  const handleAddCategory = async () => {
    if (!catTitle.trim()) return toast.warning("نام دسته را وارد کنید");
    setLoading(true);
    try {
      await axiosInstance.post("/categories", { title: catTitle });
      toast.success("دسته اصلی با موفقیت اضافه شد");
      setCatTitle("");
      fetchCategories();
    } catch (err) {
      toast.error("خطا در ثبت دسته");
    } finally {
      setLoading(false);
    }
  };

  // افزودن زیرمجموعه
  const handleAddSubCategory = async () => {
    if (!subTitle.trim() || !selectedCatId) return toast.warning("لطفا دسته والد و نام زیرمجموعه را وارد کنید");
    setLoading(true);
    try {
      await axiosInstance.post("/categories/sub", {
        title: subTitle,
        categoryId: selectedCatId,
      });
      toast.success("زیرمجموعه با موفقیت اضافه شد");
      setSubTitle("");
      fetchCategories();
    } catch (err) {
      toast.error("خطا در ثبت زیرمجموعه");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
          <FaLayerGroup className="text-3xl text-amber-600" />
          <h2 className="text-2xl font-bold">مدیریت ساختار سایت</h2>
        </div>

        {/* بخش افزودن دسته اصلی */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            افزودن دسته اصلی (مانند: نقاشی، گرافیک)
          </h3>
          <div className="flex gap-4 flex-col md:flex-row">
            <input
              type="text"
              placeholder="نام دسته جدید..."
              className="flex-1 p-3  rounded-md  bg-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-cyan-700 outline-none transition"
              value={catTitle}
              onChange={(e) => setCatTitle(e.target.value)}
            />
            <button
              onClick={handleAddCategory}
              disabled={loading}
              className="bg-sky-700 hover:bg-sky-600 text-white px-6 py-3 rounded-md flex items-center justify-center gap-2 transition shadow-md disabled:opacity-50"
            >
              <FaPlus /> افزودن
            </button>
          </div>
        </div>

        {/* بخش افزودن زیرمجموعه */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            افزودن زیرمجموعه (مانند: مدرن، کلاسیک)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              className="flex-1 p-3  rounded-md  bg-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-cyan-700 outline-none transition"
              onChange={(e) => setSelectedCatId(e.target.value)}
              value={selectedCatId}
            >
              <option value="">انتخاب دسته والد...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="نام زیرمجموعه..."
              className="flex-1 p-3  rounded-md  bg-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-cyan-700 outline-none transition"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
            />
            <button
              onClick={handleAddSubCategory}
              disabled={loading}
              className="bg-sky-700 hover:bg-sky-600 text-white px-6 py-3 rounded-md flex items-center justify-center gap-2 transition shadow-md disabled:opacity-50"
            >
              <FaPlus /> ثبت زیرمجموعه
            </button>
          </div>
        </div>

        {/* لیست درختی نمایش داده‌ها */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <FaListUl className="text-amber-500" />
            ساختار فعلی سایت
          </h3>

          {categories.length === 0 ? (
            <p className="text-center text-gray-500">هیچ دسته‌ای یافت نشد.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="border dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-xl text-gray-800 dark:text-white">
                      {cat.title}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      دسته اصلی
                    </span>
                  </div>

                  {cat.SubCategories && cat.SubCategories.length > 0 ? (
                    <div className="mr-4 border-r-2 border-gray-300 dark:border-gray-500 pr-4 space-y-2">
                      {cat.SubCategories.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 p-2 rounded-lg border dark:border-gray-600 text-sm"
                        >
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          {sub.title}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 mr-2">بدون زیرمجموعه</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;