import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  X,
  Clock,
  Star,
  Palette,
  Ruler,
  Layers,
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

const DesignPage = () => {
  /* ================= STATES ================= */
  const [loading, setLoading] = useState(true);
  const [allProjects, setAllProjects] = useState([]);
  const [designProjects, setDesignProjects] = useState([]);
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

      // فیلتر برای دسته‌بندی "طراحی"
      const designItems = projects.filter((p) => {
        if (!p.Category || !p.Category.title) return false;

        const categoryTitle = p.Category.title.toLowerCase().trim();
        const possibleNames = [
          "طراحی",
        
          "graphics",
          "طراحی گرافیک",
          "graphic design",
          "تصویرسازی",
          "illustration",
          "لوگو",
          "logo",
          "برندینگ",
          "branding",
          "تایپوگرافی",
          "typography",
          "پوستر",
          "poster",
          "کاتالوگ",
          "catalog",
          "بروشور",
          "brochure",
        ];

        return possibleNames.some((name) => categoryTitle.includes(name));
      });

      console.log("Filtered design projects:", designItems);

      // مپ کردن پروژه‌ها به فرمت طراحی
      const mappedDesigns = designItems.map((project) => {
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
          return "https://via.placeholder.com/800x600?text=طراحی";
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
          // بیشتر طراحی‌ها landscape هستند
          const ratios = ["landscape", "portrait", "square"];
          return ratios[Math.floor(Math.random() * ratios.length)];
        };

        // تعیین ارتفاع بر اساس aspect ratio
        const getHeightClass = () => {
          const ratio = getAspectRatio();
          if (ratio === "portrait") return "h-80";
          if (ratio === "landscape") return "h-64";
          return "h-72";
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
          displaySize: project.size || "نامشخص",
          displayTechnique: project.technique || "نامشخص",
          displaySoftware: project.software || "نامشخص",
          displayClient: project.client || "نامشخص",
        };
      });

      setDesignProjects(mappedDesigns);
      setAllProjects(projects);

      // استخراج زیردسته‌های منحصر به فرد
      const subs = mappedDesigns
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
      console.error("Error fetching design projects:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER BY SUB CATEGORY ================= */
  const handleSubCategory = (sub) => {
    const key = sub?.id || sub?.title;
    setActiveSub(key);

    if (key === null) {
      setFilteredProjects(designProjects);
      return;
    }

    const filtered = designProjects.filter((item) => {
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
    setFilteredProjects(designProjects);
  };

  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    if (activeSub === null) {
      setFilteredProjects(designProjects);
    } else {
      const activeSubCategory = subCategories.find(
        (sub) => sub.id === activeSub || sub.title === activeSub
      );

      if (activeSubCategory) {
        const filtered = designProjects.filter((item) => {
          if (!item.SubCategory) return false;
          if (activeSubCategory.id) {
            return item.SubCategory.id === activeSubCategory.id;
          }
          return item.SubCategory.title === activeSubCategory.title;
        });
        setFilteredProjects(filtered);
      }
    }
  }, [activeSub, designProjects, subCategories]);

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
        <div className="absolute inset-0 bg-[url('/cover.jpg')] bg-cover bg-center z-0" />
        <div className="absolute inset-0 bg-black/70 z-10" />

        <div className="container mx-auto px-4 py-20 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              طراحی و گرافیک
            </h1>
            <p className="text-xl text-cyan-300 max-w-3xl mx-auto">
              مجموعه‌ای از آثار طراحی گرافیک، تصویرسازی و پروژه‌های بصری حمیدرضا
              خواجه محمدی
            </p>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap justify-center gap-6">
              <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl">
                <div className="text-3xl font-bold">
                  {designProjects.length}+
                </div>
                <div className="text-sm opacity-90">پروژه طراحی</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl">
                <div className="text-3xl font-bold">
                  {subCategories.length}+
                </div>
                <div className="text-sm opacity-90">دسته‌بندی طراحی</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl">
                <div className="text-3xl font-bold">
                  {new Set(designProjects.map((e) => e.displayYear)).size}+
                </div>
                <div className="text-sm opacity-90">سال فعالیت طراحی</div>
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
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-8">
            هنر نقاشی، زبان بی‌کلام احساسات
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-10">
            نقاشی‌های حمیدرضا خواجه محمدی تلفیقی است از سنت‌های کهن هنر ایرانی و
            نوآوری‌های معاصر. هر اثر روایتی است از زندگی، مبارزه، امید و زیبایی.
            از نقاشی‌های اسلامی با تکنیک طلاکاری سنتی تا آثار انتزاعی معاصر، همه
            نشان‌دهنده عمق نگاه و تسلط هنرمند بر سبک‌های مختلف است.
          </p>
        </div>
        <div className="max-w-6xl mx-auto">
          {subCategories.length > 0 && (
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
          )}

          {/* ================= DESIGN GRID ================= */}
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
                      {/* تصویر طراحی */}
                      <div className="absolute inset-0">
                        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800">
                          <img
                            src={item.image}
                            alt={item.displayTitle}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                            loading="lazy"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.parentElement.innerHTML = `
                                <div class="w-full h-full flex flex-col items-center justify-center p-4">
                                  <div class="w-16 h-16 bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-full flex items-center justify-center mb-4">
                                    <Palette class="w-8 h-8 text-white" />
                                  </div>
                                  <p class="text-white text-sm">تصویر طراحی</p>
                                </div>
                              `;
                            }}
                          />
                        </div>

                        {/* گرادیان Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      </div>

                      {/* اطلاعات پایه */}
                      <div className="absolute bottom-4 right-4 left-4">
                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
                          {item.displayTitle}
                        </h3>
                        <div className="flex items-center justify-between text-white/90 text-sm">
                          <div className="flex items-center gap-1">
                            <Palette className="w-3 h-3" />
                            <span className="truncate">
                              {item.displayTechnique !== "نامشخص"
                                ? item.displayTechnique
                                : "طراحی"}
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
                <div className="text-6xl mb-6 opacity-50">🎨</div>
                <p className="text-gray-500 text-xl">موردی یافت نشد.</p>
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
                          <div class="w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 flex flex-col items-center justify-center">
                            <div class="w-20 h-20 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center mb-4">
                              <Palette class="w-10 h-10 text-amber-600" />
                            </div>
                            <p class="text-amber-700 font-medium">تصویر طراحی</p>
                          </div>
                        `;
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <div className="text-white">
                        <div className="text-sm opacity-90">سال طراحی</div>
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
                      <div className="inline-block px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-bold mb-2">
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
                              <Calendar className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                              <div>
                                <div className="font-bold text-gray-700 mb-1">
                                  سال طراحی
                                </div>
                                <div className="text-gray-600">
                                  {selectedItem.displayYear}
                                </div>
                              </div>
                            </div>
                          )}

                        {selectedItem.displayTechnique &&
                          selectedItem.displayTechnique !== "نامشخص" && (
                            <div className="flex items-start gap-3">
                              <Palette className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                              <div>
                                <div className="font-bold text-gray-700 mb-1">
                                  تکنیک
                                </div>
                                <div className="text-gray-600">
                                  {selectedItem.displayTechnique}
                                </div>
                              </div>
                            </div>
                          )}

                        {selectedItem.displaySoftware &&
                          selectedItem.displaySoftware !== "نامشخص" && (
                            <div className="flex items-start gap-3">
                              <Layers className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                              <div>
                                <div className="font-bold text-gray-700 mb-1">
                                  نرم‌افزار
                                </div>
                                <div className="text-gray-600">
                                  {selectedItem.displaySoftware}
                                </div>
                              </div>
                            </div>
                          )}
                      </div>

                      {/* ستون دوم */}
                      <div className="space-y-4">
                        {selectedItem.displaySize &&
                          selectedItem.displaySize !== "نامشخص" && (
                            <div className="flex items-start gap-3">
                              <Ruler className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                              <div>
                                <div className="font-bold text-gray-700 mb-1">
                                  اندازه
                                </div>
                                <div className="text-gray-600">
                                  {selectedItem.displaySize}
                                </div>
                              </div>
                            </div>
                          )}

                        {selectedItem.displayClient &&
                          selectedItem.displayClient !== "نامشخص" && (
                            <div className="flex items-start gap-3">
                              <Users className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                              <div>
                                <div className="font-bold text-gray-700 mb-1">
                                  کارفرما
                                </div>
                                <div className="text-gray-600">
                                  {selectedItem.displayClient}
                                </div>
                              </div>
                            </div>
                          )}

                        {selectedItem.displayLocation &&
                          selectedItem.displayLocation !== "نامشخص" && (
                            <div className="flex items-start gap-3">
                              <MapPin className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                              <div>
                                <div className="font-bold text-gray-700 mb-1">
                                  مکان
                                </div>
                                <div className="text-gray-600">
                                  {selectedItem.displayLocation}
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
                          توضیحات کامل پروژه
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {selectedItem.fullDescription}
                        </p>
                      </div>
                    )}

                    {/* اطلاعات اضافی */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">🎨</span>
                        </div>
                        <div>
                          <div className="font-bold text-gray-800">
                            پروژه طراحی
                          </div>
                          <div className="text-gray-600 text-sm">
                            این پروژه بخشی از فعالیت‌های هنری حمیدرضا خواجه
                            محمدی در زمینه طراحی و گرافیک است
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

export default DesignPage;
