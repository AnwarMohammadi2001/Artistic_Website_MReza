import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Users, X, Clock } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

const TheaterPage = () => {
  /* ================= STATES ================= */
  const [loading, setLoading] = useState(true);
  const [allProjects, setAllProjects] = useState([]);
  const [theaterProjects, setTheaterProjects] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      // فیلتر برای دسته‌بندی "تئاتر"
      const theaterItems = projects.filter((p) => {
        if (!p.Category || !p.Category.title) return false;

        const categoryTitle = p.Category.title.toLowerCase().trim();
        const possibleNames = [
          "تئاتر",
          "theater",
          "theatre",
          "نمایش",
          "play",
          "drama",
          "stage",
          "نمایشنامه",
          "نمایش صحنه‌ای",
        ];

        return possibleNames.some((name) => categoryTitle.includes(name));
      });

      console.log("Filtered theater projects:", theaterItems);

      // مپ کردن پروژه‌ها به فرمت تئاتر
      const mappedTheater = theaterItems.map((project) => {
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
          return "https://via.placeholder.com/800x600?text=تئاتر";
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
          // بیشتر تصاویر تئاتر landscape هستند
          const ratios = ["landscape", "portrait", "square"];
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
          displayDirector: project.director || "نامشخص",
          displayCast: project.cast || "نامشخص",
          displayGenre: project.genre || "نامشخص",
        };
      });

      setTheaterProjects(mappedTheater);
      setAllProjects(projects);
    } catch (error) {
      console.error("Error fetching theater projects:", error);
    } finally {
      setLoading(false);
    }
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
              آثار تئاتر و نمایش‌های صحنه‌ای
            </h1>
            <p className="text-xl text-cyan-300 max-w-3xl mx-auto">
              مجموعه‌ای از آثار نمایشی و تئاتری حمیدرضا خواجه محمدی
            </p>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap justify-center gap-6">
              <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl">
                <div className="text-3xl font-bold">
                  {theaterProjects.length}+
                </div>
                <div className="text-sm opacity-90">نمایش و تئاتر</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl">
                <div className="text-3xl font-bold">
                  {new Set(theaterProjects.map((e) => e.displayYear)).size}+
                </div>
                <div className="text-sm opacity-90">سال فعالیت تئاتری</div>
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

      {/* ================= THEATER GRID ================= */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-8">
              هنر نقاشی، زبان بی‌کلام احساسات
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-10">
              نقاشی‌های حمیدرضا خواجه محمدی تلفیقی است از سنت‌های کهن هنر ایرانی
              و نوآوری‌های معاصر. هر اثر روایتی است از زندگی، مبارزه، امید و
              زیبایی. از نقاشی‌های اسلامی با تکنیک طلاکاری سنتی تا آثار انتزاعی
              معاصر، همه نشان‌دهنده عمق نگاه و تسلط هنرمند بر سبک‌های مختلف است.
            </p>
          </div>
          <AnimatePresence>
            {theaterProjects.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {theaterProjects.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    layout
                    className={`group relative cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 ${item.heightClass}`}
                    onClick={() => openModal(item)}
                  >
                    {/* Image Container */}
                    <div className="relative w-full h-full">
                      {/* تصویر تئاتر */}
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
                                  <div class="w-16 h-16 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-full flex items-center justify-center mb-4">
                                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                  </div>
                                  <p class="text-white text-sm">تصویر تئاتر</p>
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
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">
                              {item.displayLocation.split("،")[0] ||
                                "مکان نامشخص"}
                            </span>
                          </div>
                          <span className="font-bold">{item.displayYear}</span>
                        </div>
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
                <div className="text-6xl mb-6 opacity-50">🎭</div>
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
                          <div class="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center">
                            <div class="w-20 h-20 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-full flex items-center justify-center mb-4">
                              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            </div>
                            <p class="text-white">تصویر تئاتر</p>
                          </div>
                        `;
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <div className="text-white">
                        <div className="text-sm opacity-90">سال اجرا</div>
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
                              <Calendar className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                              <div>
                                <div className="font-bold text-gray-700 mb-1">
                                  سال اجرا
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
                              <MapPin className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                              <div>
                                <div className="font-bold text-gray-700 mb-1">
                                  مکان اجرا
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
                              <Users className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
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
                              <Clock className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
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

                        {selectedItem.displayVisitors &&
                          selectedItem.displayVisitors !== "نامشخص" && (
                            <div className="flex items-start gap-3">
                              <Users className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                              <div>
                                <div className="font-bold text-gray-700 mb-1">
                                  تعداد تماشاگران
                                </div>
                                <div className="text-gray-600">
                                  {selectedItem.displayVisitors}
                                </div>
                              </div>
                            </div>
                          )}

                        {selectedItem.displayDirector &&
                          selectedItem.displayDirector !== "نامشخص" && (
                            <div className="flex items-start gap-3">
                              <svg
                                className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              <div>
                                <div className="font-bold text-gray-700 mb-1">
                                  کارگردان
                                </div>
                                <div className="text-gray-600">
                                  {selectedItem.displayDirector}
                                </div>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>

                    {/* اطلاعات اضافی تئاتر */}
                    {(selectedItem.displayCast ||
                      selectedItem.displayGenre) && (
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedItem.displayCast && (
                            <div>
                              <h4 className="font-bold text-gray-800 mb-2">
                                بازیگران
                              </h4>
                              <p className="text-gray-600 text-sm">
                                {selectedItem.displayCast}
                              </p>
                            </div>
                          )}

                          {selectedItem.displayGenre && (
                            <div>
                              <h4 className="font-bold text-gray-800 mb-2">
                                ژانر
                              </h4>
                              <p className="text-gray-600 text-sm">
                                {selectedItem.displayGenre}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* توضیحات کامل */}
                    {selectedItem.fullDescription && (
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-xl font-bold text-gray-800 mb-4">
                          توضیحات کامل نمایش
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {selectedItem.fullDescription}
                        </p>
                      </div>
                    )}

                    {/* اطلاعات اضافی */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">🎭</span>
                        </div>
                        <div>
                          <div className="font-bold text-gray-800">
                            اثر تئاتری
                          </div>
                          <div className="text-gray-600 text-sm">
                            این نمایش بخشی از فعالیت‌های هنری حمیدرضا خواجه
                            محمدی در زمینه تئاتر است
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

export default TheaterPage;
