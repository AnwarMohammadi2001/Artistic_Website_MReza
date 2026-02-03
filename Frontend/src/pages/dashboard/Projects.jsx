import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaTrash, FaEdit, FaEye, FaFilter, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false); // State to toggle filter dropdown

  // دریافت اطلاعات
  useEffect(() => {
    fetchData();
  }, [selectedCat]); // هر وقت دسته‌بندی تغییر کرد، دوباره درخواست بده

  const fetchData = async () => {
    setLoading(true);
    try {
      // دریافت پروژه‌ها (با فیلتر دسته‌بندی)
      const projRes = await axios.get(
        `${BASE_URL}/api/projects${selectedCat ? `?categoryId=${selectedCat}` : ""}`,
      );
      setProjects(projRes.data);

      // دریافت لیست دسته‌ها برای فیلتر (فقط بار اول)
      if (categories.length === 0) {
        const catRes = await axios.get(`${BASE_URL}/api/categories`);
        setCategories(catRes.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "آیا مطمئن هستید؟",
      text: "این پروژه برای همیشه حذف خواهد شد!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "بله، حذف کن",
      cancelButtonText: "لغو",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${BASE_URL}/api/projects/${id}`);
          toast.success("پروژه با موفقیت حذف شد");
          // حذف از استیت بدون رفرش
          setProjects(projects.filter((p) => p.id !== id));
        } catch (err) {
          toast.error("خطا در حذف پروژه");
        }
      }
    });
  };

  const clearFilter = () => {
    setSelectedCat("");
    setShowFilter(false);
  };

  return (
    <div
      className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white font-sans"
      dir="rtl"
    >
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          لیست
          <span className="text-sm font-normal text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
            {projects.length} عدد
          </span>
        </h2>

        {/* فیلتر دسته‌بندی */}
        <div className="relative">
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`px-4 py-2.5 border rounded-xl bg-white dark:bg-gray-800 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2 ${
                selectedCat
                  ? "text-blue-600 border-blue-300 dark:border-blue-700"
                  : ""
              }`}
            >
              <FaFilter />
              فیلتر بر اساس دسته
              {selectedCat && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {categories.find((c) => c.id === selectedCat)?.title ||
                    "دسته انتخاب شده"}
                </span>
              )}
            </button>

            {selectedCat && (
              <button
                onClick={clearFilter}
                className="px-4 py-2.5 border border-red-200 text-red-600 rounded-xl bg-red-50 dark:bg-red-900/20 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition flex items-center gap-2"
              >
                <FaTimes />
                حذف فیلتر
              </button>
            )}
          </div>

          {/* Dropdown Filter */}
          {showFilter && (
            <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10 p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">انتخاب دسته</h3>
                <button
                  onClick={() => setShowFilter(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedCat("");
                    setShowFilter(false);
                  }}
                  className={`w-full text-right px-3 py-2 rounded-lg transition ${
                    !selectedCat
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  همه دسته‌ها
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCat(cat.id);
                      setShowFilter(false);
                    }}
                    className={`w-full text-right px-3 py-2 rounded-lg transition ${
                      selectedCat === cat.id
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {cat.title}
                    {selectedCat === cat.id && (
                      <span className="mr-2 text-xs">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">هیچ پروژه‌ای یافت نشد.</p>
          {selectedCat && (
            <button
              onClick={clearFilter}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              حذف فیلتر و مشاهده همه
            </button>
          )}
        </div>
      ) : (
        /* Table / Cards */
        <div className="grid grid-cols-1 gap-4">
          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-200 dark:bg-gray-700 p-4  font-bold text-sm">
            <div className="col-span-1 text-center">تصویر</div>
            <div className="col-span-4">عنوان اثر</div>
            <div className="col-span-3">دسته‌بندی</div>
            <div className="col-span-2 text-center">تاریخ</div>
            <div className="col-span-2 text-center">عملیات</div>
          </div>

          {/* Project Items */}
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 p-4  border border-gray-100 dark:border-gray-700 flex flex-col md:grid md:grid-cols-12 gap-4 items-center hover:shadow-md transition"
            >
              {/* Image */}
              <div className="col-span-1 w-full md:w-auto flex justify-center">
                {project.mediaType === "video" ? (
                  <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center text-white text-xs">
                    VIDEO
                  </div>
                ) : (
                  <img
                    src={
                      project.mainImage
                        ? `http://localhost:5000${project.mainImage}`
                        : "https://via.placeholder.com/150"
                    }
                    alt={project.title}
                    className="w-16 h-16 object-cover rounded-lg border dark:border-gray-600"
                  />
                )}
              </div>

              {/* Title */}
              <div className="col-span-4 w-full text-center md:text-right">
                <h3 className="font-bold text-lg">{project.title}</h3>
                <p className="text-xs text-gray-500 truncate">
                  {project.description}
                </p>
              </div>

              {/* Category */}
              <div className="col-span-3 w-full text-center md:text-right flex flex-col items-center md:items-start">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-1">
                  {project.Category?.title || "بدون دسته"}
                </span>
                {project.SubCategory && (
                  <span className="text-xs text-gray-500">
                    ↳ {project.SubCategory.title}
                  </span>
                )}
              </div>

              {/* Date */}
              <div className="col-span-2 text-sm text-gray-500">
                {project.date || "-"}
              </div>

              {/* Actions */}
              <div className="col-span-2 flex gap-2 justify-center w-full">
                {/* <button
                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                  title="مشاهده"
                >
                  <FaEye />
                </button>
                <button
                  className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition"
                  title="ویرایش"
                >
                  <FaEdit />
                </button> */}
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                  title="حذف"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
