import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Palette,
  Building,
  Search,
  Filter,
  X,
  Maximize2,
  ChevronDown,
} from "lucide-react";

const MiscellaneousPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columns, setColumns] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 768) setColumns(1);
      else if (window.innerWidth < 1200) setColumns(2);
      else setColumns(3);
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const categories = [
    {
      id: "all",
      label: "همه",
      count: 12,
      icon: <Filter className="w-5 h-5" />,
      color: "from-blue-500 to-indigo-500",
    },
    {
      id: "photography",
      label: "عکاسی",
      count: 6,
      icon: <Camera className="w-5 h-5" />,
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: "sculpture",
      label: "مجسمه‌سازی",
      count: 4,
      icon: <Palette className="w-5 h-5" />,
      color: "from-amber-500 to-orange-500",
    },
    {
      id: "architecture",
      label: "معماری",
      count: 8,
      icon: <Building className="w-5 h-5" />,
      color: "from-purple-500 to-pink-500",
    },
  ];

  const sortOptions = [
    { id: "date", label: "تاریخ (جدیدترین)" },
    { id: "date-old", label: "تاریخ (قدیمی‌ترین)" },
    { id: "title", label: "عنوان (الف-ی)" },
    { id: "title-rev", label: "عنوان (ی-الف)" },
  ];

  // Sample data for photography, sculpture, and architecture
  const items = [
    // Photography
    {
      id: 1,
      type: "photography",
      title: "طبیعت در قاب",
      description:
        "عکس‌برداری از مناظر طبیعی در غروب آفتاب با تکنیک نوردهی طولانی",
      year: "۱۴۰۲",
      artist: "علی محمدی",
      location: "شمال ایران",
      src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["طبیعت", "غروب", "منظره"],
      aspectRatio: "landscape",
      featured: true,
    },
    {
      id: 2,
      type: "photography",
      title: "پرتره انسانی",
      description: "پرتره سیاه و سفید از چهره‌های متفاوت با نورپردازی رامبراند",
      year: "۱۴۰۱",
      artist: "فاطمه رضایی",
      location: "تهران",
      src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["پرتره", "سیاه و سفید", "چهره"],
      aspectRatio: "portrait",
    },
    {
      id: 3,
      type: "photography",
      title: "معماری شهری",
      description: "نمایی مدرن از ساختمان‌های شهری با زوایای هندسی",
      year: "۱۴۰۰",
      artist: "محمد حسینی",
      location: "شیراز",
      src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["شهری", "معماری", "مدرن"],
      aspectRatio: "square",
    },
    {
      id: 4,
      type: "photography",
      title: "زندگی خیابانی",
      description: "مستندنگاری از زندگی روزمره در بازار سنتی",
      year: "۱۳۹۹",
      artist: "سارا احمدی",
      location: "اصفهان",
      src: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["خیابانی", "مستند", "زندگی"],
      aspectRatio: "landscape",
    },
    {
      id: 5,
      type: "photography",
      title: "حیات وحش",
      description: "عکس‌برداری از پرندگان در زیستگاه طبیعی",
      year: "۱۴۰۲",
      artist: "رضا کریمی",
      location: "مازندران",
      src: "https://images.unsplash.com/photo-1551085254-e96b210db58a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["حیات وحش", "پرندگان", "طبیعت"],
      aspectRatio: "landscape",
    },
    {
      id: 6,
      type: "photography",
      title: "انتزاع هندسی",
      description: "عکس‌های انتزاعی با استفاده از سایه و نور",
      year: "۱۴۰۱",
      artist: "نازنین محمودی",
      location: "تبریز",
      src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["انتزاعی", "هندسی", "سایه"],
      aspectRatio: "square",
    },

    // Sculpture
    {
      id: 7,
      type: "sculpture",
      title: "تجسم انسان مدرن",
      description: "مجسمه برنزی با ارتفاع ۲ متر با الهام از فرم‌های انسانی",
      year: "۱۳۹۸",
      artist: "حمیدرضا خواجه‌محمدی",
      location: "موزه هنرهای معاصر تهران",
      src: "https://images.unsplash.com/photo-1569930784237-ea5e51c4f7c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["برنز", "انسان", "مدرن"],
      aspectRatio: "portrait",
      featured: true,
    },
    {
      id: 8,
      type: "sculpture",
      title: "نقش برجسته تاریخی",
      description: "سنگ مرمر با نقش‌برجسته از صحنه‌های تاریخی",
      year: "۱۳۹۵",
      artist: "مرتضی اسدی",
      location: "کاخ نیاوران",
      src: "https://images.unsplash.com/photo-1599741295376-5f1e1ad415cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["سنگ مرمر", "تاریخی", "نقش برجسته"],
      aspectRatio: "landscape",
    },
    {
      id: 9,
      type: "sculpture",
      title: "انتزاع فلزی",
      description: "ساختار فلزی با فرم‌های انتزاعی و مدرن",
      year: "۱۴۰۰",
      artist: "لیلا جعفری",
      location: "پارک هنرمندان",
      src: "https://images.unsplash.com/photo-1577560965171-3f27bf7d9e3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["فلز", "انتزاعی", "ساختار"],
      aspectRatio: "square",
    },
    {
      id: 10,
      type: "sculpture",
      title: "پیکره‌سازی سنتی",
      description: "مجسمه گچی با تکنیک‌های سنتی ایرانی",
      year: "۱۳۹۷",
      artist: "احمد نوری",
      location: "موزه ملی ایران",
      src: "https://images.unsplash.com/photo-1579781306499-a3d4a64a28e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["گچ", "سنتی", "ایرانی"],
      aspectRatio: "portrait",
    },

    // Architecture
    {
      id: 11,
      type: "architecture",
      title: "خانه مدرن ایرانی",
      description: "طراحی مسکونی با ترکیب معماری مدرن و عناصر سنتی ایرانی",
      year: "۱۴۰۲",
      architect: "دکتر مهدی شیرازی",
      location: "شمال تهران",
      src: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["مسکونی", "مدرن ایرانی", "طراحی"],
      aspectRatio: "landscape",
      featured: true,
    },
    {
      id: 12,
      type: "architecture",
      title: "برج تجاری شهر",
      description: "سازه ۴۰ طبقه با طراحی پایدار و مصرف انرژی بهینه",
      year: "۱۴۰۱",
      architect: "گروه مهندسی آرمان",
      location: "مرکز تجاری تهران",
      src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["تجاری", "پایدار", "برج"],
      aspectRatio: "landscape",
    },
    {
      id: 13,
      type: "architecture",
      title: "موزه هنر معاصر",
      description: "طراحی موزه با نورگیرهای خاص و فضاهای نمایشی منعطف",
      year: "۱۳۹۹",
      architect: "فرهاد احمدی",
      location: "اصفهان",
      src: "https://images.unsplash.com/photo-1580130588675-8c5544b2d2c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["موزه", "هنری", "نمایشی"],
      aspectRatio: "landscape",
    },
    {
      id: 14,
      type: "architecture",
      title: "پل تاریخی",
      description: "مرمت و بازسازی پل تاریخی با حفظ اصالت معماری",
      year: "۱۳۹۸",
      architect: "مهندسین مشاور فرهنگ",
      location: "شیراز",
      src: "https://images.unsplash.com/photo-1548626346-b3c2dce64f5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["تاریخی", "مرمت", "پل"],
      aspectRatio: "landscape",
    },
    {
      id: 15,
      type: "architecture",
      title: "خانه باغ سنتی",
      description: "طراحی باغ ایرانی با الحاقات معماری سنتی",
      year: "۱۳۹۷",
      architect: "استاد حسین طاهری",
      location: "کاشان",
      src: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["باغ ایرانی", "سنتی", "خانه باغ"],
      aspectRatio: "landscape",
    },
    {
      id: 16,
      type: "architecture",
      title: "مجتمع فرهنگی",
      description: "فضای چندمنظوره فرهنگی با طراحی معاصر",
      year: "۱۴۰۰",
      architect: "شرکت طرح و معماری",
      location: "مشهد",
      src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["فرهنگی", "چندمنظوره", "معاصر"],
      aspectRatio: "landscape",
    },
    {
      id: 17,
      type: "architecture",
      title: "ویلا ساحلی",
      description: "طراحی ویلای مدرن با دید به دریا",
      year: "۱۴۰۲",
      architect: "نوید رحیمی",
      location: "جزیره کیش",
      src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["ویلا", "ساحلی", "مدرن"],
      aspectRatio: "landscape",
    },
    {
      id: 18,
      type: "architecture",
      title: "مرکز خرید مدرن",
      description: "طراحی مرکز خرید با رویکرد تجربه خرید متفاوت",
      year: "۱۴۰۱",
      architect: "دپارتمان طراحی شهری",
      location: "شهرک غرب تهران",
      src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["تجاری", "مرکز خرید", "مدرن"],
      aspectRatio: "landscape",
    },
  ];

  // Filter and sort items
  const filteredItems = items
    .filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.type === activeCategory;
      const matchesSearch =
        searchTerm === "" ||
        item.title.includes(searchTerm) ||
        item.description.includes(searchTerm) ||
        item.tags.some((tag) => tag.includes(searchTerm));

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.year) - new Date(a.year);
        case "date-old":
          return new Date(a.year) - new Date(b.year);
        case "title":
          return a.title.localeCompare(b.title, "fa");
        case "title-rev":
          return b.title.localeCompare(a.title, "fa");
        default:
          return 0;
      }
    });

  // Create masonry columns
  const createMasonryColumns = () => {
    const columnArrays = Array.from({ length: columns }, () => []);
    const columnHeights = Array(columns).fill(0);

    filteredItems.forEach((item) => {
      let itemHeight;
      switch (item.aspectRatio) {
        case "portrait":
          itemHeight = 450 + Math.random() * 100;
          break;
        case "landscape":
          itemHeight = 300 + Math.random() * 80;
          break;
        case "square":
          itemHeight = 350 + Math.random() * 60;
          break;
        default:
          itemHeight = 350;
      }

      const shortestColumnIndex = columnHeights.indexOf(
        Math.min(...columnHeights)
      );
      columnArrays[shortestColumnIndex].push(item);
      columnHeights[shortestColumnIndex] += itemHeight;
    });

    return columnArrays;
  };

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

  const masonryColumns = createMasonryColumns();

  const getCategoryColor = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.color : "from-gray-500 to-gray-600";
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
      dir="rtl"
    >
      {/* Header */}
      <div className="  py-12 px-4 relative overflow-hidden">
       

        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-3xl text-gray-900 lg:text-3xl font-bold mb-3">
              گالری هنرهای تجسمی
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              مجموعه‌ای از بهترین آثار عکاسی، مجسمه‌سازی و معماری هنرمندان
              ایرانی
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8  max-w-7xl  relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
       
        >
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Category Filter Buttons */}
            <div className="w-full">
              <div className="flex flex-wrap justify-center gap-3 mb-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`relative px-6 py-3 group font-medium cursor-pointer transition-colors duration-300
                      ${
                        activeCategory === category.id
                          ? "text-cyan-600"
                          : "text-gray-600 hover:text-cyan-600"
                      }`}
                  >
                    {category.label}

                    <span
                      className={`absolute right-0 -bottom-1 h-[2px] w-full bg-cyan-700 transform transition-transform duration-500
                        ${
                          activeCategory === category.id
                            ? "scale-x-100 origin-right"
                            : "scale-x-0 origin-left group-hover:scale-x-100 group-hover:origin-right"
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Masonry Grid */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
        <AnimatePresence mode="wait">
          {filteredItems.length > 0 ? (
            <motion.div
              key={`${activeCategory}-${columns}-${sortBy}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {masonryColumns.map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col gap-4">
                  {column.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
                      onClick={() => openModal(item)}
                      style={{
                        minHeight:
                          item.aspectRatio === "portrait"
                            ? "450px"
                            : item.aspectRatio === "landscape"
                            ? "320px"
                            : "350px",
                      }}
                    >
                      

                      {/* Category Badge */}
                      <div className="absolute top-4 right-4 z-10">
                        <span
                          className={`bg-gradient-to-r ${getCategoryColor(
                            item.type
                          )} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm bg-opacity-90`}
                        >
                          {categories.find((c) => c.id === item.type)?.label}
                        </span>
                      </div>

                      {/* Image Container */}
                      <div className="relative w-full h-full overflow-hidden">
                        <img
                          src={item.src}
                          alt={item.title}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                          loading="lazy"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-xl font-bold mb-2">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-200 line-clamp-2 mb-3">
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
                                  {item.year}
                                </span>
                                <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
                                  {item.location}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Maximize2 className="w-4 h-4" />
                                <span className="text-xs">مشاهده</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                   
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-6 opacity-50">🎨</div>
              <p className="text-gray-500 text-xl mb-4">اثری یافت نشد.</p>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                لطفاً عبارت جستجوی خود را تغییر دهید یا دسته‌بندی دیگری را
                انتخاب کنید.
              </p>
              <button
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg"
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory("all");
                }}
              >
                پاک کردن جستجو
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MiscellaneousPage;
