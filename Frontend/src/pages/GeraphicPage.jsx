import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import GeraphicCart from "./components/GeraphicPage/GeraphicCart";
import GeraphicModal from "./components/GeraphicPage/GeraphicModal";

const GeraphicPage = () => {
  /* ================= STATES ================= */
  const [loading, setLoading] = useState(true);

  const [allProjects, setAllProjects] = useState([]); // همه پروژه‌ها
  const [graphicProjects, setGraphicProjects] = useState([]); // فقط گرافیک
  const [filteredProjects, setFilteredProjects] = useState([]);

  const [subCategories, setSubCategories] = useState([]);
  const [activeSub, setActiveSub] = useState(null);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [paintings, setPaintings] = useState([]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchProjects();
  }, []);
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/projects");
      const projects = res.data || [];

      // اول همه دسته‌بندی‌ها را بررسی کنید
      const allCategories = projects
        .map((p) => p.Category?.title)
        .filter(Boolean);

      const uniqueCategories = [...new Set(allCategories)];
      console.log("ALL AVAILABLE CATEGORIES:", uniqueCategories);

      // اگر "گرافیک" وجود ندارد، شاید نامش متفاوت است
      // مثلا: "graphic", "Graphics", "گرافیک", "طراحی گرافیک" و غیره
      const graphic = projects.filter((p) => {
        if (!p.Category || !p.Category.title) return false;

        const categoryTitle = p.Category.title.toLowerCase().trim();
        const possibleNames = [
          "گرافیک",
          "graphic",
          "graphics",
          "طراحی گرافیک",
          "graphic design",
        ];

        return possibleNames.some((name) => categoryTitle.includes(name));
      });

      console.log("Filtered graphic projects:", graphic);

      // بقیه کد مانند قبل...
      setGraphicProjects(graphic);
      setFilteredProjects(graphic);

    const subs = graphic
      .map((p) => p.SubCategory)
      .filter((s) => s && (s.id || s.title));

    const uniqueSubs = Array.from(
      new Map(
        subs.map((s) => [s.id ? `id-${s.id}` : `title-${s.title}`, s])
      ).values()
    );

    setSubCategories(uniqueSubs);


      setSubCategories(uniqueSubs);

      // اگر پروژه‌ای وجود دارد، اولین زیردسته را فعال کنید
      if (uniqueSubs.length > 0) {
        setActiveSub(uniqueSubs[0].id || uniqueSubs[0].title);
      } else if (graphic.length > 0) {
        // اگر زیردسته‌ای ندارند، "همه" را فعال نگه دارید
        setActiveSub(null);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER BY SUB CATEGORY ================= */
 const handleSubCategory = (sub) => {
   setActiveSub(sub.id || sub.title);

   const filtered = graphicProjects.filter((p) => {
     if (!p.SubCategory) return false;

     if (sub.id) {
       return p.SubCategory.id === sub.id;
     }

     return p.SubCategory.title === sub.title;
   });

   setFilteredProjects(filtered);
 };

  useEffect(() => {
    console.log("All Projects:", allProjects);
    console.log("Graphic Projects:", graphicProjects);
    console.log("Sub Categories:", subCategories);
  }, [allProjects, graphicProjects, subCategories]);

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
        <div className="w-14 h-14 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= SUB CATEGORIES ================= */}
      <div className="relative overflow-hidden bg-gray-700 pb-5">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('/cover.jpg')] bg-cover bg-center z-0" />

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
                [`${paintings.length}+`, "اثر هنری"],
                ["۱۵+", "نمایشگاه بین‌المللی"],
              ].map(([value, label]) => (
                <div key={label} className=" px-6 py-3 rounded-full">
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
      <div className="container mx-auto px-4 py-10">
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
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => {
              setActiveSub(null);
              setFilteredProjects(graphicProjects);
            }}
            className={`px-6 py-3 font-bold ${
              activeSub === null
                ? "text-cyan-600 border-b-2 cursor-pointer border-cyan-600"
                : "text-gray-500"
            }`}
          >
            همه
          </button>

          {subCategories.map((sub) => {
            const key = sub.id || sub.title;
            const isActive = activeSub === key;

            return (
              <button
                key={key}
                onClick={() => handleSubCategory(sub)}
                className={`px-6 py-3 font-bold transition-all cursor-pointer duration-300 ${
                  isActive
                    ? "text-cyan-600 border-b-2 border-cyan-600"
                    : "text-gray-500 hover:text-cyan-600"
                }`}
              >
                {sub.title}
              </button>
            );
          })}
        </div>

        {/* ================= PROJECTS ================= */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSub}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {filteredProjects.map((item) => (
              <GeraphicCart
                key={item.id}
                item={item}
                itemVariants={itemVariants}
                openModal={openModal}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20 text-gray-500 text-xl">
            هنوز پروژه‌ای در این بخش وجود ندارد.
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
            <GeraphicModal
              selectedItem={selectedItem}
              closeModal={closeModal}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GeraphicPage;
