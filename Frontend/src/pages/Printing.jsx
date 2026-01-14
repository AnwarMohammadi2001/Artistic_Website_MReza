import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../utils/axiosInstance";
import PaintingCart from "./components/Painting/PaintingCart";
import PaintingModal from "./components/Painting/PaintingModal";

const Printing = () => {
  /* ================= STATES ================= */
  const [loading, setLoading] = useState(true);
  const [allProjects, setAllProjects] = useState([]);
  const [paintingProjects, setPaintingProjects] = useState([]);
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

      // First, check all available categories
      const allCategories = projects
        .map((p) => p.Category?.title)
        .filter(Boolean);

      const uniqueCategories = [...new Set(allCategories)];
      console.log("ALL AVAILABLE CATEGORIES:", uniqueCategories);

      // Filter for painting category (فارسی و انگلیسی)
      const painting = projects.filter((p) => {
        if (!p.Category || !p.Category.title) return false;

        const categoryTitle = p.Category.title.toLowerCase().trim();
        const possibleNames = [
          "نقاشی",
          "painting",
          "paintings",
          "نقاشي",
          "رنگ‌روغن",
          "آبرنگ",
          "نگارگری",
        ];

        return possibleNames.some((name) => categoryTitle.includes(name));
      });

      console.log("Filtered painting projects:", painting);

      setPaintingProjects(painting);
      setFilteredProjects(painting);
      setAllProjects(projects);

      // Extract unique subcategories
      const subs = painting
        .map((p) => p.SubCategory)
        .filter((s) => s && (s.id || s.title));

      const uniqueSubs = Array.from(
        new Map(
          subs.map((s) => [s.id ? `id-${s.id}` : `title-${s.title}`, s])
        ).values()
      );

      setSubCategories(uniqueSubs);

      // Activate first subcategory if exists
      if (uniqueSubs.length > 0) {
        setActiveSub(uniqueSubs[0].id || uniqueSubs[0].title);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER BY SUB CATEGORY ================= */
  const handleSubCategory = (sub) => {
    const key = sub.id || sub.title;
    setActiveSub(key);

    const filtered = paintingProjects.filter((p) => {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال دریافت اطلاعات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= HERO SECTION ================= */}
      <div className="relative overflow-hidden bg-gray-700 pb-5">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('/cover.JPG')] bg-cover bg-center z-0" />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70 z-10" />

        {/* Content */}
        <div className="container mx-auto px-4 py-20 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl lg:text-4xl font-bold mb-4 leading-tight">
              گالری نقاشی‌های
              <span className="block text-cyan-500 mt-2">
                حمیدرضا خواجه محمدی
              </span>
            </h1>

            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-100 leading-relaxed">
              مروری بر چهار دهه خلق آثار هنری در سبک‌های مختلف از نقاشی اسلامی
              تا هنر معاصر انتزاعی
            </p>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {[
                ["۴۰+", "سال تجربه"],
                [`${paintingProjects.length}+`, "اثر هنری"],
                ["۱۵+", "نمایشگاه بین‌المللی"],
              ].map(([value, label]) => (
                <div key={label} className="px-6 py-3 rounded-full">
                  <span className="font-bold text-2xl">{value}</span>
                  <p className="text-sm text-gray-200">{label}</p>
                </div>
              ))}
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

      {/* ================= INTRODUCTION SECTION ================= */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-8">
            هنر نقاشی، زبان بی‌کلام احساسات
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-10">
            نقاشی‌های حمیدرضا خواجه محمدی تلفیقی است از سنت‌های کهن هنر ایرانی و
            نوآوری‌های معاصر. هر اثر روایتی است از زندگی، مبارزه، امید و زیبایی.
            از نقاشی‌های اسلامی با تکنیک طلاکاری سنتی تا آثار انتزاعی معاصر، همه
            نشان‌دهنده عمق نگاه و تسلط هنرمند بر سبک‌های مختلف است.
          </p>

          {/* ================= SUB CATEGORIES BUTTONS ================= */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => {
                setActiveSub(null);
                setFilteredProjects(paintingProjects);
              }}
              className={`relative px-6 py-3 group font-medium cursor-pointer transition-colors duration-300 ${
                activeSub === null
                  ? "text-cyan-600"
                  : "text-gray-600 hover:text-cyan-600"
              }`}
            >
              همه آثار
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
        </div>
      </div>

      {/* ================= PAINTINGS GRID ================= */}
      <div className="container mx-auto px-4 pb-20">
        {filteredProjects.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSub}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map((item) => (
                <PaintingCart
                  key={item.id}
                  painting={item}
                  openModal={openModal}
                  itemVariants={itemVariants}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">
              هنوز اثری در این دسته‌بندی ثبت نشده است.
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
            <PaintingModal
              selectedPainting={selectedItem}
              closeModal={closeModal}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Printing;
