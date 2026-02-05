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
  const [showFilter, setShowFilter] = useState(false);
  const [allProjects, setAllProjects] = useState([]);

  // دریافت اطلاعات
  useEffect(() => {
    fetchAllProjects();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCat) {
      setProjects(allProjects);
      return;
    }

    const selectedCategoryTitle = categories.find(
      (c) => c.id === Number(selectedCat),
    )?.title;

    const filtered = allProjects.filter(
      (project) => project.Category?.title === selectedCategoryTitle,
    );

    setProjects(filtered);
  }, [selectedCat, allProjects, categories]);

  const fetchAllProjects = async () => {
    setLoading(true);
    try {
      const projRes = await axios.get(`${BASE_URL}/api/projects`);
      setAllProjects(projRes.data);
      setProjects(projRes.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      toast.error("خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const catRes = await axios.get(`${BASE_URL}/api/categories`);
      setCategories(catRes.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const filterProjectsByCategory = (categoryId) => {
    console.log("Filtering by category ID:", categoryId);
    console.log("All projects:", allProjects.length);

    if (!categoryId || categoryId === "") {
      setProjects(allProjects);
      return;
    }

    // تبدیل categoryId به number برای مقایسه صحیح
    const categoryIdNum = Number(categoryId);

    const filtered = allProjects.filter((project) => {
      const categoryMatch = project.Category?.id === categoryIdNum;
      console.log(
        `Project ${project.id}: Category ID = ${project.Category?.id}, Match = ${categoryMatch}`,
      );
      return categoryMatch;
    });

    console.log("Filtered projects:", filtered.length);
    setProjects(filtered);
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
          setProjects(projects.filter((p) => p.id !== id));
          setAllProjects(allProjects.filter((p) => p.id !== id));
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

  const getCategoryProjectsCount = (categoryId) => {
    if (!categoryId) return allProjects.length;

    const categoryIdNum = Number(categoryId);
    return allProjects.filter((p) => p.Category?.id === categoryIdNum).length;
  };

  // برای دیباگ - چاپ اطلاعات
  useEffect(() => {
    if (categories.length > 0 && allProjects.length > 0) {
      console.log("Categories:", categories);
      console.log("First project's category:", allProjects[0]?.Category);
    }
  }, [categories, allProjects]);

  return (
    <div
      className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white font-sans"
      dir="rtl"
    >
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold">مدیریت پروژه‌ها</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            تعداد کل پروژه‌ها: {allProjects.length} عدد
          </p>
        </div>

        {/* دکمه فیلتر اصلی */}
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
                  {categories.find((c) => c.id === Number(selectedCat))
                    ?.title || "دسته انتخاب شده"}
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
                  className={`w-full text-right px-3 py-2 rounded-lg transition flex justify-between items-center ${
                    !selectedCat
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span>همه دسته‌ها</span>
                  <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {allProjects.length}
                  </span>
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCat(cat.id.toString());
                      setShowFilter(false);
                    }}
                    className={`w-full text-right px-3 py-2 rounded-lg transition flex justify-between items-center ${
                      selectedCat === cat.id.toString()
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {selectedCat === cat.id.toString() && (
                        <span className="text-blue-500">✓</span>
                      )}
                      <span>{cat.title}</span>
                    </div>
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {getCategoryProjectsCount(cat.id.toString())}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Filter Buttons - زیر هدر */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FaFilter className="text-gray-500" />
          <h3 className="font-medium">فیلتر سریع بر اساس دسته:</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* دکمه همه */}
          <button
            onClick={() => setSelectedCat("")}
            className={`px-4 py-2 rounded-lg border transition flex items-center gap-2 ${
              !selectedCat
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            همه پروژه‌ها
          </button>

          {/* دکمه‌های دسته‌بندی */}
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id.toString())}
              className={`px-4 py-2 rounded-lg border transition flex items-center gap-2 ${
                selectedCat === cat.id.toString()
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* نمایش فیلتر فعال */}
        {selectedCat && (
          <div className="mt-4 flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <span className="text-sm">
              نمایش پروژه‌های دسته:{" "}
              <strong>
                {categories.find((c) => c.id === Number(selectedCat))?.title ||
                  "نامشخص"}
              </strong>
              <span className="text-gray-500 mr-2">
                ({projects.length} پروژه)
              </span>
            </span>
            <button
              onClick={clearFilter}
              className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
            >
              <FaTimes />
              حذف فیلتر
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">
            {selectedCat
              ? "هیچ پروژه‌ای در این دسته یافت نشد."
              : "هیچ پروژه‌ای یافت نشد."}
          </p>
          {selectedCat && (
            <button
              onClick={clearFilter}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              حذف فیلتر و مشاهده همه پروژه‌ها
            </button>
          )}
        </div>
      ) : (
        /* Table / Cards */
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-100 dark:bg-gray-700 p-4 font-bold text-sm">
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
              className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col md:grid md:grid-cols-12 gap-4 items-center hover:bg-gray-50 dark:hover:bg-gray-750 transition"
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
                        ? `${BASE_URL}${project.mainImage}`
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
