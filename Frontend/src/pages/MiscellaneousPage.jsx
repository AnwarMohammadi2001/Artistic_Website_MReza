import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import MiscellaneousCart from "../pages/components/MiscellaneousPage/MiscellaneousCart";
import MiscellaneousModal from "../pages/components/MiscellaneousPage/MiscellaneousModal";
import {
  Music,
  BookOpen,
  Film,
  Gamepad2,
  ChefHat,
  Car,
  Globe,
  Lightbulb,
  Coffee,
  Palette,
  Camera,
  Building,
} from "lucide-react";

const MiscellaneousPage = () => {
  /* ================= STATES ================= */
  const [loading, setLoading] = useState(true);
  const [miscProjects, setMiscProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [activeSub, setActiveSub] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ================= CATEGORIES ================= */
  const categories = [
    {
      id: "music",
      label: "موزیک و صوت",
      icon: <Music className="w-5 h-5" />,
      color: "from-emerald-500 to-teal-500",
      description: "آثار صوتی، موسیقی و پادکست‌ها",
    },
    {
      id: "books",
      label: "کتاب‌خوانی",
      icon: <BookOpen className="w-5 h-5" />,
      color: "from-amber-500 to-orange-500",
      description: "نقد کتاب، معرفی آثار و مقالات ادبی",
    },
    {
      id: "movies",
      label: "فیلم و سینما",
      icon: <Film className="w-5 h-5" />,
      color: "from-purple-500 to-pink-500",
      description: "نقد فیلم، تحلیل سینمایی و مستند",
    },
    {
      id: "games",
      label: "بازی و سرگرمی",
      icon: <Gamepad2 className="w-5 h-5" />,
      color: "from-red-500 to-rose-500",
      description: "بازی‌های ویدیویی، فکری و سرگرمی",
    },
    {
      id: "cooking",
      label: "آشپزی",
      icon: <ChefHat className="w-5 h-5" />,
      color: "from-yellow-500 to-red-500",
      description: "دستور پخت، تکنیک‌ها و فرهنگ غذایی",
    },
    {
      id: "travel",
      label: "سفر و گردشگری",
      icon: <Globe className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-500",
      description: "تجربیات سفر، راهنمای گردشگری",
    },
    {
      id: "tech",
      label: "تکنولوژی",
      icon: <Lightbulb className="w-5 h-5" />,
      color: "from-indigo-500 to-purple-500",
      description: "فناوری‌های جدید، گجت‌ها و نوآوری",
    },
    {
      id: "lifestyle",
      label: "سبک زندگی",
      icon: <Coffee className="w-5 h-5" />,
      color: "from-brown-500 to-amber-500",
      description: "سلامت، آرامش و بهبود کیفیت زندگی",
    },
  ];

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/projects");
      const projects = res.data || [];

      // Filter miscellaneous projects
      const misc = projects.filter((p) => {
        if (!p.Category || !p.Category.title) return false;
        const categoryTitle = p.Category.title.toLowerCase().trim();

        // Include various miscellaneous categories
        const miscCategories = [
          "متفرقه",
          "miscellaneous",
          "other",
          "دیگر",
          "موزیک",
          "موسیقی",
          "music",
          "کتاب",
          "book",
          "فیلم",
          "movie",
          "بازی",
          "game",
          "آشپزی",
          "cooking",
          "سفر",
          "travel",
          "تکنولوژی",
          "technology",
          "سبک زندگی",
          "lifestyle",
        ];

        return miscCategories.some((cat) => categoryTitle.includes(cat));
      });

      console.log("Filtered miscellaneous projects:", misc);
      setMiscProjects(misc);
      setFilteredProjects(misc);

      // Extract subcategories
      const subs = misc
        .map((p) => p.SubCategory)
        .filter((s) => s && (s.id || s.title));

      const uniqueSubs = Array.from(
        new Map(
          subs.map((s) => [s.id ? `id-${s.id}` : `title-${s.title}`, s])
        ).values()
      );

      setSubCategories(uniqueSubs);

      // Set default active subcategory
      if (uniqueSubs.length > 0) {
        setActiveSub(uniqueSubs[0].id || uniqueSubs[0].title);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);

      // Fallback to sample data if API fails
      setFilteredProjects(sampleItems);
      setSubCategories(sampleSubCategories);
      setActiveSub(sampleSubCategories[0]?.id || "all");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER BY SUB CATEGORY ================= */
  const handleSubCategory = (sub) => {
    if (sub === null) {
      setActiveSub(null);
      setFilteredProjects(miscProjects);
      return;
    }

    const key = sub.id || sub.title;
    setActiveSub(key);

    const filtered = miscProjects.filter((p) => {
      if (!p.SubCategory) return false;

      if (sub.id) {
        return p.SubCategory.id === sub.id;
      }
      return p.SubCategory.title === sub.title;
    });

    setFilteredProjects(filtered.length > 0 ? filtered : miscProjects);
  };

  /* ================= SAMPLE DATA (Fallback) ================= */
  const sampleSubCategories = [
    { id: "all", title: "همه" },
    { id: "recommended", title: "پیشنهادی" },
    { id: "popular", title: "محبوب‌ترین" },
    { id: "recent", title: "جدیدترین" },
  ];

  const sampleItems = [
    {
      id: 1,
      title: "آهنگ‌سازی مدرن",
      description: "ترکیب موسیقی الکترونیک و سنتی ایرانی",
      year: "۱۴۰۲",
      category: "music",
      artist: "رضا شجاعی",
      tags: ["موسیقی", "الکترونیک", "ایرانی"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    {
      id: 2,
      title: "معرفی رمان ایرانی",
      description: "مروری بر بهترین رمان‌های نویسندگان معاصر ایران",
      year: "۱۴۰۱",
      category: "books",
      artist: "مریم محمودی",
      tags: ["کتاب", "رمان", "ادبیات"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    {
      id: 3,
      title: "نقد فیلم ایرانی",
      description: "تحلیل فیلم‌های برتر سینمای ایران",
      year: "۱۴۰۲",
      category: "movies",
      artist: "علی کریمی",
      tags: ["فیلم", "سینما", "نقد"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    {
      id: 4,
      title: "آشپزی ایرانی",
      description: "آموزش پخت غذاهای اصیل ایرانی",
      year: "۱۴۰۱",
      category: "cooking",
      artist: "سارا احمدی",
      tags: ["آشپزی", "غذای ایرانی", "آموزش"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    {
      id: 5,
      title: "سفر به شمال",
      description: "تجربه سفر به جنگل‌های شمال ایران",
      year: "۱۴۰۲",
      category: "travel",
      artist: "محمد رضایی",
      tags: ["سفر", "طبیعت", "ایران"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    {
      id: 6,
      title: "نوآوری‌های تکنولوژی",
      description: "معرفی جدیدترین فناوری‌های سال",
      year: "۱۴۰۲",
      category: "tech",
      artist: "امیرحسین محمدی",
      tags: ["تکنولوژی", "نوآوری", "فناوری"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    {
      id: 7,
      title: "بازی‌های ایرانی",
      description: "معرفی بازی‌های موبایلی ساخت ایران",
      year: "۱۴۰۱",
      category: "games",
      artist: "پریسا نوروزی",
      tags: ["بازی", "موبایل", "ایرانی"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    {
      id: 8,
      title: "مدیتیشن روزانه",
      description: "تمرینات ساده برای آرامش ذهن",
      year: "۱۴۰۲",
      category: "lifestyle",
      artist: "فاطمه حسینی",
      tags: ["سبک زندگی", "سلامت", "آرامش"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
  ];

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

  /* ================= GET CATEGORY INFO ================= */
  const getCategoryInfo = (categoryId) => {
    return categories.find((cat) => cat.id === categoryId) || categories[0];
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="w-14 h-14 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
      dir="rtl"
    >
      <div className="relative overflow-hidden py-24">
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
              گالری متفرقه
            </h1>
            <p className="text-xl text-cyan-300 max-w-3xl mx-auto">
              مجموعه‌ای از آثار متنوع
            </p>
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

      {/* ================= SUB CATEGORIES ================= */}
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
        <div className="flex flex-wrap justify-center gap-3 mb-12">
        

          {subCategories.map((sub) => {
            const key = sub.id || sub.title;
            const isActive = activeSub === key;

            return (
              <button
                key={key}
                onClick={() => handleSubCategory(sub)}
                className={`relative px-6 py-3 group font-medium cursor-pointer transition-colors duration-300 ${
                  activeSub === null
                    ? "text-cyan-600"
                    : "text-gray-600 hover:text-cyan-600"
                }`}
              >
                {sub.title}
                <span
                  className={`absolute right-0 -bottom-1 h-[2px] w-full bg-cyan-600 transform transition-transform duration-500 ${
                    activeSub === null
                      ? "scale-x-100 origin-right"
                      : "scale-x-0 origin-left group-hover:scale-x-100 group-hover:origin-right"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* ================= PROJECTS GRID ================= */}
        <AnimatePresence mode="wait">
          {filteredProjects.length > 0 ? (
            <motion.div
              key={activeSub}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredProjects.map((item) => {
                const categoryInfo = getCategoryInfo(item.category);
                return (
                  <MiscellaneousCart
                    key={item.id}
                    item={item}
                    categoryInfo={categoryInfo}
                    itemVariants={itemVariants}
                    openModal={openModal}
                  />
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-6 opacity-50">🎨</div>
              <p className="text-gray-500 text-xl mb-4">
                اثری در این بخش یافت نشد.
              </p>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                لطفاً دسته‌بندی دیگری را انتخاب کنید یا منتظر اضافه شدن آثار
                جدید باشید.
              </p>
              <button
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg"
                onClick={() => handleSubCategory(null)}
              >
                مشاهده همه آثار
              </button>
            </motion.div>
          )}
        </AnimatePresence>
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
            <MiscellaneousModal
              selectedItem={selectedItem}
              categoryInfo={getCategoryInfo(selectedItem.category)}
              closeModal={closeModal}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MiscellaneousPage;
