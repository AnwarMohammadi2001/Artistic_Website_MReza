import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import AchievementsCart from "./components/Achievements/AchievementsCart";
import AchievementsModal from "./components/Achievements/AchievementsModal";
import { Award, Medal, ScrollText, Star } from "lucide-react";

const AchievementsPage = () => {
  /* ================= STATES ================= */
  const [loading, setLoading] = useState(true);
  const [allProjects, setAllProjects] = useState([]);
  const [achievementProjects, setAchievementProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [activeSub, setActiveSub] = useState(null);
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

      // فیلتر برای دسته‌بندی "دستاوردها"
      const achievements = projects.filter((p) => {
        if (!p.Category || !p.Category.title) return false;

        const categoryTitle = p.Category.title.toLowerCase().trim();
        const possibleNames = [
          "دستاورد",
          "دستاوردها",
          "achievement",
          "achievements",
          "افتخارات",
          "جوایز",
          "تقدیر",
          "award",
          "prize",
          "honor",
        ];

        return possibleNames.some((name) => categoryTitle.includes(name));
      });

      console.log("Filtered achievement projects:", achievements);

      // مپ کردن پروژه‌ها به فرمت دستاورد
      const mappedAchievements = achievements.map((project) => {
        // تعیین آیکون بر اساس زیردسته
        let Icon = Award; // آیکون پیش‌فرض

        if (project.SubCategory && project.SubCategory.title) {
          const subTitle = project.SubCategory.title.toLowerCase();
          if (subTitle.includes("تقدیر") || subTitle.includes("certificate")) {
            Icon = ScrollText;
          } else if (
            subTitle.includes("نمایشگاه") ||
            subTitle.includes("exhibition")
          ) {
            Icon = Medal;
          } else if (
            subTitle.includes("جایزه") ||
            subTitle.includes("award") ||
            subTitle.includes("نشان")
          ) {
            Icon = Award;
          } else if (
            subTitle.includes("افتخار") ||
            subTitle.includes("honor")
          ) {
            Icon = Star;
          }
        }

        // ساخت URL تصویر
        const getImageUrl = () => {
          if (!project.mainImage) return null;
          if (project.mainImage.startsWith("http")) return project.mainImage;

          const BASE_URL =
            import.meta.env.VITE_BASE_URL || "http://localhost:5000";
          if (project.mainImage.startsWith("/")) {
            return `${BASE_URL}${project.mainImage}`;
          }
          return `${BASE_URL}/${project.mainImage}`;
        };

        return {
          ...project,
          image: getImageUrl(),
          Icon: Icon,
          displayYear:
            project.date ||
            new Date(project.createdAt).getFullYear().toString() ||
            "نامشخص",
          displayOrganizer:
            project.organizer || project.exhibitionName || "نامشخص",
          // برای دسته‌بندی‌ها
          categoryType: determineCategoryType(project),
        };
      });

      setAchievementProjects(mappedAchievements);
      setFilteredProjects(mappedAchievements);
      setAllProjects(projects);

      // استخراج زیردسته‌های منحصر به فرد
      const subs = mappedAchievements
        .map((p) => p.SubCategory)
        .filter((s) => s && (s.id || s.title));

      const uniqueSubs = Array.from(
        new Map(
          subs.map((s) => [s.id ? `id-${s.id}` : `title-${s.title}`, s])
        ).values()
      );

      setSubCategories(uniqueSubs);

      // فعال کردن اولین زیردسته اگر وجود دارد
      if (uniqueSubs.length > 0) {
        setActiveSub(uniqueSubs[0].id || uniqueSubs[0].title);
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
    } finally {
      setLoading(false);
    }
  };

  // تابع برای تعیین نوع دسته‌بندی
  const determineCategoryType = (project) => {
    if (!project.SubCategory || !project.SubCategory.title) return "all";

    const subTitle = project.SubCategory.title.toLowerCase();
    if (subTitle.includes("تقدیر") || subTitle.includes("certificate")) {
      return "certificate";
    } else if (
      subTitle.includes("نمایشگاه") ||
      subTitle.includes("exhibition")
    ) {
      return "exhibition";
    } else if (
      subTitle.includes("جایزه") ||
      subTitle.includes("award") ||
      subTitle.includes("نشان")
    ) {
      return "award";
    }
    return "all";
  };

  /* ================= FILTER BY SUB CATEGORY ================= */
  const handleSubCategory = (sub) => {
    const key = sub.id || sub.title;
    setActiveSub(key);

    const filtered = achievementProjects.filter((p) => {
      if (!p.SubCategory) return false;

      if (sub.id) {
        return p.SubCategory.id === sub.id;
      }

      return p.SubCategory.title === sub.title;
    });

    setFilteredProjects(filtered);
  };

  /* ================= MODAL ================= */
  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              دستاوردها و افتخارات
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              مروری بر جوایز، تقدیرنامه‌ها و حضورهای بین‌المللی
              <span className="font-semibold text-white">
                {" "}
                حمیدرضا خواجه محمدی{" "}
              </span>
            </p>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap justify-center gap-6">
              <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl">
                <div className="text-3xl font-bold">
                  {achievementProjects.length}+
                </div>
                <div className="text-sm opacity-90">دستاورد و افتخار</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl">
                <div className="text-3xl font-bold">
                  {
                    achievementProjects.filter(
                      (a) => a.categoryType === "award"
                    ).length
                  }
                  +
                </div>
                <div className="text-sm opacity-90">جایزه و نشان</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl">
                <div className="text-3xl font-bold">
                  {
                    achievementProjects.filter(
                      (a) => a.categoryType === "exhibition"
                    ).length
                  }
                  +
                </div>
                <div className="text-sm opacity-90">نمایشگاه بین‌المللی</div>
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

      {/* ================= INTRODUCTION ================= */}
      <div className="container mx-auto px-4 py-12 text-center max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          افتخاراتی در مسیر هنر
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          این دستاوردها حاصل سال‌ها تلاش، خلاقیت و حضور فعال در عرصه‌های ملی و
          بین‌المللی هنرهای تجسمی است.
        </p>
      </div>

      {/* ================= SUB CATEGORIES FILTER ================= */}
      <div className="container mx-auto px-4 pb-6">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => {
              setActiveSub(null);
              setFilteredProjects(achievementProjects);
            }}
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

        {/* ================= ACHIEVEMENTS CARDS ================= */}
        {filteredProjects.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSub}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredProjects.map((item) => (
                <AchievementsCart
                  key={item.id}
                  item={item}
                  itemVariants={itemVariants}
                  openModal={openModal}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🏆</div>
            <p className="text-gray-500 text-xl">
              موردی برای این دسته‌بندی ثبت نشده است.
            </p>
          </div>
        )}
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
            <div
              className="absolute inset-0 bg-black/70"
              onClick={closeModal}
            />
            <AchievementsModal
              selectedItem={selectedItem}
              closeModal={closeModal}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AchievementsPage;
