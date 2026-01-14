import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Users, X, Clock } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

const ExhibitionPage = () => {
  /* ================= STATES ================= */
  const [loading, setLoading] = useState(true);
  const [allProjects, setAllProjects] = useState([]);
  const [exhibitionProjects, setExhibitionProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [activeSub, setActiveSub] = useState(null);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/projects");
      const projects = res.data || [];

      // بررسی همه دسته‌بندی‌های موجود
      const allCategories = projects
        .map((p) => p.Category?.title)
        .filter(Boolean);

      const uniqueCategories = [...new Set(allCategories)];
      console.log("ALL AVAILABLE CATEGORIES:", uniqueCategories);

      // فیلتر برای دسته‌بندی "نمایشگاه"
      const exhibitions = projects.filter((p) => {
        if (!p.Category || !p.Category.title) return false;

        const categoryTitle = p.Category.title.toLowerCase().trim();
        const possibleNames = [
          "نمایشگاه",
          "exhibition",
          "exhibitions",
          "گالری",
          "gallery",
          "نمایش",
          "show",
          "expo",
        ];

        return possibleNames.some((name) => categoryTitle.includes(name));
      });

      console.log("Filtered exhibition projects:", exhibitions);

      // مپ کردن پروژه‌ها به فرمت نمایشگاه
      const mappedExhibitions = exhibitions.map((project) => {
        // ساخت URL تصویر
        const getImageUrl = () => {
          if (project.mainImage) {
            if (project.mainImage.startsWith("http")) {
              return project.mainImage;
            }
            const BASE_URL =
              import.meta.env.VITE_BASE_URL || "http://localhost:5000";
            if (project.mainImage.startsWith("/")) {
              return `${BASE_URL}${project.mainImage}`;
            }
            return `${BASE_URL}/${project.mainImage}`;
          }
          // تصویر پیش‌فرض
          return "https://via.placeholder.com/800x600?text=نمایشگاه";
        };

        // تعیین aspect ratio
        const getAspectRatio = () => {
          if (project.size) {
            if (project.size.includes("×")) {
              const [width, height] = project.size.split("×").map(Number);
              if (width > height) return "landscape";
              if (height > width) return "portrait";
              return "square";
            }
          }
          // تصادفی انتخاب کن برای نمایش زیباتر
          const ratios = ["portrait", "landscape", "square"];
          return ratios[Math.floor(Math.random() * ratios.length)];
        };

        // تعیین ارتفاع بر اساس aspect ratio
        const getHeightClass = () => {
          const ratio = getAspectRatio();
          if (ratio === "portrait") return "h-96";
          if (ratio === "landscape") return "h-64";
          return "h-80";
        };

        return {
          ...project,
          image: getImageUrl(),
          aspectRatio: getAspectRatio(),
          heightClass: getHeightClass(),
          displayTitle: project.title || "بدون عنوان",
          displayDescription:
            project.description || project.fullDescription || "بدون توضیحات",
          displayYear:
            project.date ||
            new Date(project.createdAt).getFullYear().toString() ||
            "نامشخص",
          displayLocation: project.location || "نامشخص",
          displayOrganizer:
            project.organizer || project.exhibitionName || "نامشخص",
          displayDuration: project.duration || "نامشخص",
          displayVisitors: project.visitors || "نامشخص",
        };
      });

      setExhibitionProjects(mappedExhibitions);
      setFilteredProjects(mappedExhibitions);
      setAllProjects(projects);

      // استخراج زیردسته‌های منحصر به فرد
      const subs = mappedExhibitions
        .map((p) => p.SubCategory)
        .filter((s) => s && (s.id || s.title));

      const uniqueSubs = Array.from(
        new Map(
          subs.map((s) => [s.id ? `id-${s.id}` : `title-${s.title}`, s])
        ).values()
      );

      console.log("Extracted Subcategories:", uniqueSubs);
      setSubCategories(uniqueSubs);

      // فعال کردن "همه" به صورت پیش‌فرض
      setActiveSub(null);
    } catch (error) {
      console.error("Error fetching exhibitions:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER BY SUB CATEGORY ================= */
  const handleSubCategory = (sub) => {
    const key = sub?.id || sub?.title;
    setActiveSub(key);

    if (key === null) {
      setFilteredProjects(exhibitionProjects);
      return;
    }

    const filtered = exhibitionProjects.filter((item) => {
      if (!item.SubCategory) return false;

      if (sub.id) {
        return item.SubCategory.id === sub.id;
      }

      return item.SubCategory.title === sub.title;
    });

    setFilteredProjects(filtered);
  };

  const showAllItems = () => {
    setActiveSub(null);
    setFilteredProjects(exhibitionProjects);
  };

  /* ================= MODAL ================= */
  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    document.body.style.overflow = "auto";
  };

  /* ================= ANIMATION ================= */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال دریافت اطلاعات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ================= HERO SECTION ================= */}
      <div className="relative overflow-hidden pb-6">
        <div className="absolute inset-0 bg-[url('/cover.JPG')] bg-cover bg-center z-0" />
        <div className="absolute inset-0 bg-black/70 z-10" />

        <div className="container mx-auto px-4 py-20 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              نمایشگاه‌ها و رویدادهای هنری
            </h1>
            <p className="text-xl text-cyan-300 max-w-3xl mx-auto">
              مجموعه‌ای از برگزیده‌ترین نمایشگاه‌های حمیدرضا خواجه محمدی در
              ایران و جهان
            </p>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap justify-center gap-6">
              <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl">
                <div className="text-3xl font-bold">
                  {exhibitionProjects.length}+
                </div>
                <div className="text-sm opacity-90">نمایشگاه برگزار شده</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl">
                <div className="text-3xl font-bold">
                  {subCategories.length}+
                </div>
                <div className="text-sm opacity-90">دسته‌بندی موضوعی</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl">
                <div className="text-3xl font-bold">
                  {new Set(exhibitionProjects.map((e) => e.displayYear)).size}+
                </div>
                <div className="text-sm opacity-90">سال فعالیت نمایشگاهی</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 z-30">
          <svg
            className="w-full h-[120px]"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path d="M0,0V120H1200V0C800,80 400,80 0,0Z" fill="white" />
          </svg>
        </div>
      </div>

      {/* ================= SUBCATEGORY FILTERS ================= */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              {/* دکمه "همه" */}
              <button
                onClick={showAllItems}
                className={`relative px-6 py-3 group font-medium cursor-pointer transition-colors duration-300 ${
                  activeSub === null
                    ? "text-cyan-600"
                    : "text-gray-600 hover:text-cyan-600"
                }`}
              >
                همه
                <span
                  className={`absolute right-0 -bottom-1 h-[2px] w-full bg-cyan-600 transform transition-transform duration-500 ${
                    activeSub === null
                      ? "scale-x-100 origin-right"
                      : "scale-x-0 origin-left group-hover:scale-x-100 group-hover:origin-right"
                  }`}
                />
              </button>

              {/* زیردسته‌ها */}
              {subCategories.map((sub) => {
                const key = sub.id || sub.title;
                const isActive = activeSub === key;

                return (
                  <button
                    key={key}
                    onClick={() => handleSubCategory(sub)}
                    className={`relative px-6 py-3 group font-medium cursor-pointer transition-colors duration-300 ${
                      isActive
                        ? "text-cyan-600"
                        : "text-gray-600 hover:text-cyan-600"
                    }`}
                  >
                    {sub.title}
                    <span
                      className={`absolute right-0 -bottom-1 h-[2px] w-full bg-cyan-600 transform transition-transform duration-500 ${
                        isActive
                          ? "scale-x-100 origin-right"
                          : "scale-x-0 origin-left group-hover:scale-x-100 group-hover:origin-right"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================= EXHIBITION GRID ================= */}
          <AnimatePresence mode="wait">
            {filteredProjects.length > 0 ? (
              <motion.div
                key={activeSub}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProjects.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    layout
                    className={`group relative cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 ${item.heightClass}`}
                    onClick={() => openModal(item)}
                  >
                    {/* Image Container */}
                    <div className="relative w-full h-full">
                      {/* تصویر نمایشگاه */}
                      <div className="absolute inset-0">
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300">
                          <img
                            src={item.image}
                            alt={item.displayTitle}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.parentElement.innerHTML = `
                                <div class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex flex-col items-center justify-center p-4">
                                  <div class="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                                    <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                  </div>
                                  <p class="text-gray-500">تصویر نمایشگاه</p>
                                  ${
                                    item.SubCategory
                                      ? `<span class="mt-2 px-2 py-1 bg-gray-400/20 rounded-full text-xs text-gray-600">${item.SubCategory.title}</span>`
                                      : ""
                                  }
                                </div>
                              `;
                            }}
                          />
                        </div>

                        {/* گرادیان Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      </div>

                      {/* اطلاعات پایه (همیشه نمایش داده می‌شود) */}
                      <div className="absolute bottom-4 right-4 left-4">
                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
                          {item.displayTitle}
                        </h3>
                        <div className="flex items-center justify-between text-white/90 text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">
                              {item.displayLocation.split("،")[0] ||
                                "مکان نامشخص"}
                            </span>
                          </div>
                          <span className="font-bold">{item.displayYear}</span>
                        </div>
                        {item.SubCategory && (
                          <span className="inline-block mt-2 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                            {item.SubCategory.title}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-6 opacity-50">🏛️</div>
                <p className="text-gray-500 text-xl">
                  موردی در این دسته‌بندی یافت نشد.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {isModalOpen && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/90 backdrop-blur-sm"
              onClick={closeModal}
            />

            {/* Modal Content */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
                className="relative bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 left-4 z-50 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 md:top-6 md:left-6"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* سمت چپ: تصویر */}
                <div className="md:w-1/2 h-64 md:h-auto">
                  <div className="relative w-full h-full">
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.displayTitle}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `
                          <div class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex flex-col items-center justify-center">
                            <div class="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                              <svg class="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                              </svg>
                            </div>
                            <p class="text-gray-500">تصویر نمایشگاه</p>
                          </div>
                        `;
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <div className="text-white">
                        <div className="text-sm opacity-90">سال برگزاری</div>
                        <div className="text-2xl font-bold">
                          {selectedItem.displayYear}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* سمت راست: محتوا */}
                <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto">
                  <div className="space-y-6">
                    {/* Category Badge */}
                    {selectedItem.SubCategory && (
                      <div className="inline-block px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-bold mb-2">
                        {selectedItem.SubCategory.title}
                      </div>
                    )}

                    {/* عنوان */}
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                        {selectedItem.displayTitle}
                      </h2>
                      <p className="text-gray-600 text-lg">
                        {selectedItem.displayDescription}
                      </p>
                    </div>

                    {/* جزئیات */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* ستون اول */}
                      <div className="space-y-4">
                        {selectedItem.displayYear &&
                          selectedItem.displayYear !== "نامشخص" && (
                            <div className="flex items-start gap-3">
                              <Calendar className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                              <div>
                                <div className="font-bold text-gray-700 mb-1">
                                  سال برگزاری
                                </div>
                                <div className="text-gray-600">
                                  {selectedItem.displayYear}
                                </div>
                              </div>
                            </div>
                          )}

                        {selectedItem.displayLocation &&
                          selectedItem.displayLocation !== "نامشخص" && (
                            <div className="flex items-start gap-3">
                              <MapPin className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                              <div>
                                <div className="font-bold text-gray-700 mb-1">
                                  مکان نمایشگاه
                                </div>
                                <div className="text-gray-600">
                                  {selectedItem.displayLocation}
                                </div>
                              </div>
                            </div>
                          )}

                        {selectedItem.displayOrganizer &&
                          selectedItem.displayOrganizer !== "نامشخص" && (
                            <div className="flex items-start gap-3">
                              <Users className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                              <div>
                                <div className="font-bold text-gray-700 mb-1">
                                  برگزارکننده
                                </div>
                                <div className="text-gray-600">
                                  {selectedItem.displayOrganizer}
                                </div>
                              </div>
                            </div>
                          )}
                      </div>

                      {/* ستون دوم */}
                      <div className="space-y-4">
                        {selectedItem.displayDuration &&
                          selectedItem.displayDuration !== "نامشخص" && (
                            <div className="flex items-start gap-3">
                              <Clock className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                              <div>
                                <div className="font-bold text-gray-700 mb-1">
                                  مدت زمان
                                </div>
                                <div className="text-gray-600">
                                  {selectedItem.displayDuration}
                                </div>
                              </div>
                            </div>
                          )}

                        {selectedItem.visitors && (
                          <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                            <div>
                              <div className="font-bold text-gray-700 mb-1">
                                تعداد بازدیدکنندگان
                              </div>
                              <div className="text-gray-600">
                                {selectedItem.visitors}
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedItem.date && (
                          <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                            <div>
                              <div className="font-bold text-gray-700 mb-1">
                                تاریخ دقیق
                              </div>
                              <div className="text-gray-600">
                                {selectedItem.date}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* توضیحات کامل */}
                    {selectedItem.fullDescription && (
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-xl font-bold text-gray-800 mb-4">
                          توضیحات کامل نمایشگاه
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {selectedItem.fullDescription}
                        </p>
                      </div>
                    )}

                    {/* اطلاعات اضافی */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">🏛️</span>
                        </div>
                        <div>
                          <div className="font-bold text-gray-800">
                            نمایشگاه هنری
                          </div>
                          <div className="text-gray-600 text-sm">
                            این نمایشگاه بخشی از فعالیت‌های هنری حمیدرضا خواجه
                            محمدی است
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExhibitionPage;
