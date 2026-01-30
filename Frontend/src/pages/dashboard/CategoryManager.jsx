import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaLayerGroup,
  FaListUl,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdExpandMore,
  MdExpandLess,
  MdOutlineAirlineSeatReclineExtra,
} from "react-icons/md";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [catTitle, setCatTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [selectedCatId, setSelectedCatId] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [editCategoryTitle, setEditCategoryTitle] = useState("");
  const [editSubCategoryTitle, setEditSubCategoryTitle] = useState("");

  // دریافت اطلاعات
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/categories`);
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
      await axios.post(`${BASE_URL}/api/categories`, { title: catTitle });
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
    if (!subTitle.trim() || !selectedCatId)
      return toast.warning("لطفا دسته والد و نام زیرمجموعه را وارد کنید");
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/categories/sub`, {
        title: subTitle,
        categoryId: selectedCatId,
      });
      toast.success("زیرمجموعه با موفقیت اضافه شد");
      setSubTitle("");
      setSelectedCatId("");
      fetchCategories();
    } catch (err) {
      toast.error("خطا در ثبت زیرمجموعه");
    } finally {
      setLoading(false);
    }
  };

  // حذف دسته اصلی
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("آیا از حذف این دسته مطمئن هستید؟")) return;

    try {
      await axios.delete(`${BASE_URL}/api/categories/${id}`);
      toast.success("دسته با موفقیت حذف شد");
      fetchCategories();
    } catch (err) {
      toast.error("خطا در حذف دسته");
    }
  };

  // حذف زیرمجموعه
  const handleDeleteSubCategory = async (id) => {
    if (!window.confirm("آیا از حذف این زیرمجموعه مطمئن هستید؟")) return;

    try {
      await axios.delete(`${BASE_URL}/api/categories/sub/${id}`);
      toast.success("زیرمجموعه با موفقیت حذف شد");
      fetchCategories();
    } catch (err) {
      toast.error("خطا در حذف زیرمجموعه");
    }
  };

  // شروع ویرایش دسته اصلی
  const startEditCategory = (category) => {
    setEditingCategory(category.id);
    setEditCategoryTitle(category.title);
    setEditingSubCategory(null);
  };

  // شروع ویرایش زیرمجموعه
  const startEditSubCategory = (subCategory) => {
    setEditingSubCategory(subCategory.id);
    setEditSubCategoryTitle(subCategory.title);
    setEditingCategory(null);
  };

  // ذخیره ویرایش دسته اصلی
  const saveEditCategory = async (id) => {
    if (!editCategoryTitle.trim()) {
      toast.warning("نام دسته نمی‌تواند خالی باشد");
      return;
    }

    try {
      await axios.put(`${BASE_URL}/api/categories/${id}`, {
        title: editCategoryTitle,
      });
      toast.success("دسته با موفقیت ویرایش شد");
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      toast.error("خطا در ویرایش دسته");
    }
  };

  // ذخیره ویرایش زیرمجموعه
  const saveEditSubCategory = async (id) => {
    if (!editSubCategoryTitle.trim()) {
      toast.warning("نام زیرمجموعه نمی‌تواند خالی باشد");
      return;
    }

    try {
      await axios.put(`${BASE_URL}/api/categories/sub/${id}`, {
        title: editSubCategoryTitle,
      });
      toast.success("زیرمجموعه با موفقیت ویرایش شد");
      setEditingSubCategory(null);
      fetchCategories();
    } catch (err) {
      toast.error("خطا در ویرایش زیرمجموعه");
    }
  };

  // لغو ویرایش
  const cancelEdit = () => {
    setEditingCategory(null);
    setEditingSubCategory(null);
  };

  // باز/بسته کردن دسته
  const toggleCategory = (id) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id],
    );
  };

  // انتخاب دسته از dropdown
  const handleSelectCategory = (id, title) => {
    setSelectedCatId(id);
    setDropdownOpen(false);
  };

  return (
    <div
      className="p-4 md:p-6 min-h-screen bg-gradient-to-br rounded-md from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 font-sans transition-colors duration-300"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg">
            <FaLayerGroup className="text-2xl text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              مدیریت ساختار سایت
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              ایجاد، ویرایش و مدیریت دسته‌بندی‌ها و زیرمجموعه‌ها
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* بخش افزودن دسته اصلی */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all hover:shadow-xl">
            <h3 className="text-lg font-semibold mb-4 pb-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FaPlus className="text-blue-600 dark:text-blue-400" />
              </div>
              افزودن دسته اصلی جدید
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  نام دسته اصلی
                </label>
                <input
                  type="text"
                  placeholder="مثال: نقاشی، گرافیک، طراحی..."
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  value={catTitle}
                  onChange={(e) => setCatTitle(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
                />
              </div>
              <button
                onClick={handleAddCategory}
                disabled={loading || !catTitle.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <FaPlus /> {loading ? "در حال ثبت..." : "افزودن دسته اصلی"}
              </button>
            </div>
          </div>

          {/* بخش افزودن زیرمجموعه */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all hover:shadow-xl">
            <h3 className="text-lg font-semibold mb-4 pb-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FaPlus className="text-green-600 dark:text-green-400" />
              </div>
              افزودن زیرمجموعه جدید
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  دسته والد
                </label>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex justify-between items-center focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-right"
                  >
                    <span
                      className={
                        selectedCatId
                          ? "text-gray-800 dark:text-gray-200"
                          : "text-gray-500"
                      }
                    >
                      {selectedCatId
                        ? categories.find((c) => c.id === selectedCatId)?.title
                        : "انتخاب دسته والد..."}
                    </span>
                    <MdKeyboardArrowDown
                      className={`text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {dropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <ul className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto rounded-xl bg-white dark:bg-gray-800 shadow-xl border dark:border-gray-600">
                        {categories.length === 0 ? (
                          <li className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                            دسته‌ای یافت نشد
                          </li>
                        ) : (
                          categories.map((cat) => (
                            <li
                              key={cat.id}
                              onClick={() =>
                                handleSelectCategory(cat.id, cat.title)
                              }
                              className={`px-4 py-3 cursor-pointer hover:bg-green-50 dark:hover:bg-gray-700 transition border-b dark:border-gray-700 last:border-b-0
                                ${selectedCatId === cat.id ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "text-gray-700 dark:text-gray-300"}
                              `}
                            >
                              <div className="flex items-center justify-between">
                                <span>{cat.title}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {cat.SubCategories?.length || 0} زیرمجموعه
                                </span>
                              </div>
                            </li>
                          ))
                        )}
                      </ul>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  نام زیرمجموعه
                </label>
                <input
                  type="text"
                  placeholder="مثال: پرتره، منظره، آبستره..."
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleAddSubCategory()
                  }
                />
              </div>

              <button
                onClick={handleAddSubCategory}
                disabled={loading || !subTitle.trim() || !selectedCatId}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <FaPlus /> {loading ? "در حال ثبت..." : "افزودن زیرمجموعه"}
              </button>
            </div>
          </div>
        </div>

        {/* ساختار فعلی سایت */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 mt-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <FaListUl className="text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">ساختار فعلی سایت</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {categories.length} دسته اصلی •{" "}
                  {categories.reduce(
                    (acc, cat) => acc + (cat.SubCategories?.length || 0),
                    0,
                  )}{" "}
                  زیرمجموعه
                </p>
              </div>
            </div>
            <button
              onClick={fetchCategories}
              className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition"
            >
              بروزرسانی
            </button>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <FaLayerGroup className="text-3xl text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                هیچ دسته‌ای یافت نشد.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                اولین دسته خود را ایجاد کنید
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="border dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900/50 hover:shadow-md transition"
                >
                  {/* هدر دسته */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 border-b dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleCategory(cat.id)}
                          className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition"
                        >
                          {expandedCategories.includes(cat.id) ? (
                            <MdKeyboardArrowUp className="text-xl" />
                          ) : (
                            <MdKeyboardArrowDown className="text-xl" />
                          )}
                        </button>

                        {editingCategory === cat.id ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={editCategoryTitle}
                              onChange={(e) =>
                                setEditCategoryTitle(e.target.value)
                              }
                              className="p-2 rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none flex-1"
                              autoFocus
                            />
                            <button
                              onClick={() => saveEditCategory(cat.id)}
                              className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                            >
                              <FaSave />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="font-bold text-lg text-gray-800 dark:text-white">
                              {cat.title}
                            </span>
                            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-3 py-1 rounded-full">
                              {cat.SubCategories?.length || 0} زیرمجموعه
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {editingCategory !== cat.id && (
                          <>
                            <button
                              onClick={() => startEditCategory(cat)}
                              className="p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition"
                              title="ویرایش"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="p-2 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition"
                              title="حذف"
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* زیرمجموعه‌ها */}
                  {expandedCategories.includes(cat.id) && (
                    <div className="p-4">
                      {cat.SubCategories && cat.SubCategories.length > 0 ? (
                        <div className="space-y-2 mr-4">
                          {cat.SubCategories.map((sub) => (
                            <div
                              key={sub.id}
                              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-3 h-3 bg-green-500 rounded-full"></span>

                                {editingSubCategory === sub.id ? (
                                  <div className="flex items-center gap-2 flex-1">
                                    <input
                                      type="text"
                                      value={editSubCategoryTitle}
                                      onChange={(e) =>
                                        setEditSubCategoryTitle(e.target.value)
                                      }
                                      className="p-2 rounded-lg border border-green-300 dark:border-green-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 outline-none flex-1"
                                      autoFocus
                                    />
                                    <button
                                      onClick={() =>
                                        saveEditSubCategory(sub.id)
                                      }
                                      className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                                    >
                                      <FaSave />
                                    </button>
                                    <button
                                      onClick={cancelEdit}
                                      className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                                    >
                                      <FaTimes />
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-gray-700 dark:text-gray-300">
                                    {sub.title}
                                  </span>
                                )}
                              </div>

                              {editingSubCategory !== sub.id && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => startEditSubCategory(sub)}
                                    className="p-2 text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30 rounded-lg transition"
                                    title="ویرایش"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteSubCategory(sub.id)
                                    }
                                    className="p-2 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition"
                                    title="حذف"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                          <p>این دسته هیچ زیرمجموعه‌ای ندارد</p>
                          <p className="text-sm mt-1">
                            برای افزودن زیرمجموعه، از بخش بالا استفاده کنید
                          </p>
                        </div>
                      )}

                      {/* دکمه افزودن زیرمجموعه سریع */}
                      <div className="mt-4 mr-4">
                        <button
                          onClick={() => {
                            setSelectedCatId(cat.id);
                            setSubTitle("");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="text-sm px-4 py-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2"
                        >
                          <FaPlus /> افزودن زیرمجموعه جدید به این دسته
                        </button>
                      </div>
                    </div>
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
