import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ZoomIn,
  Calendar,
  Palette,
  Award,
  BookOpen,
  Image as ImageIcon,
  Film,
  Download,
  Share2,
  Heart,
  Eye,
} from "lucide-react";

const GeraphicPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  const categories = [
    {
      id: "all",
      label: "همه آثار",
      icon: "🎨",
    },
    {
      id: "poster",
      label: "پوستر",
    },
    {
      id: "book",
      label: "تصویرسازی کتاب",
    },
  ];

  const designItems = [
    {
      id: 1,
      title: "نمایشگاه هنر معاصر تهران",
      category: "poster",
      type: "پوستر فرهنگی",
      year: "۱۴۰۲",
      client: "موزه هنرهای معاصر",
      description:
        "طراحی پوستر نمایشگاه بین‌المللی هنر معاصر با تلفیق خطاطی ایرانی و المان‌های مدرن",
      fullDescription:
        "این پوستر برای نمایشگاه سالانه هنر معاصر تهران طراحی شده است. در طراحی از تکنیک دیجیتال و دستی استفاده شده و ترکیبی از خطاطی سنتی ایرانی با تایپوگرافی مدرن را ارائه می‌دهد. رنگ‌بندی طلایی و مشکی نماد هنر اصیل ایرانی است.",
      image: "cover1.JPG",
      awards: ["جایزه طراحی ملی ۱۴۰۲", "نشان طلای طراحی گرافیک"],
      dimensions: "۷۰ × ۱۰۰ سانتی‌متر",
      likes: 142,
      views: 890,
    },
    {
      id: 2,
      title: "قصه‌های کهن ایرانی",
      category: "book",
      type: "تصویرسازی کتاب کودک",
      year: "۱۴۰۱",
      client: "انتشارات فرهنگ",
      description:
        "مجموعه تصویرسازی برای کتاب قصه‌های عامیانه ایرانی با رویکرد مدرن",
      fullDescription:
        "این پروژه شامل ۳۵ تصویرسازی برای کتاب داستان کودکان است. هر تصویر با تکنیک دیجیتال و دستی خلق شده و المان‌های فرهنگ ایرانی را با سبک مدرن ترکیب کرده است.",
      image: "cover2.JPG",
      awards: ["جایزه بهترین تصویرسازی کتاب کودک"],
      tools: ["Procreate", "Adobe Fresco", "Photoshop"],
      dimensions: "A4",
      likes: 98,
      views: 654,
    },
    {
      id: 3,
      title: "برندینگ کافه بوتیک",
      category: "branding",
      type: "هویت بصری",
      year: "۱۴۰۰",
      client: "کافه هنر تهران",
      description: "طراحی کامل هویت بصری برای کافه‌گالری مدرن در تهران",
      fullDescription:
        "طراحی کامل هویت بصری شامل لوگو، کارت ویزیت، منو، بسته‌بندی و فضای داخلی. استفاده از رنگ‌های طبیعی و خطوط ارگانیک برای القای حس آرامش و هنر.",
      image: "cover3.JPG",
      awards: [],
      tools: ["Adobe Illustrator", "InDesign", "Figma"],
      dimensions: "متنوع",
      likes: 167,
      views: 1023,
    },
    {
      id: 4,
      title: "بسته‌بندی چای ویژه",
      category: "packaging",
      type: "طراحی بسته‌بندی",
      year: "۱۳۹۹",
      client: "کارخانه چای ایرانی",
      description: "طراحی بسته‌بندی لوکس برای چای مرغوب ایرانی",
      fullDescription:
        "طراحی بسته‌بندی چای با الهام از نقوش اسلیمی ایرانی و استفاده از مواد بازیافتی. این طراحی برنده جایزه طراحی سبز شد.",
      image: "cover1.JPG",
      awards: ["جایزه طراحی سبز ۱۳۹۹"],
      tools: ["Adobe Dimension", "Illustrator", "Blender"],
      dimensions: "۲۰ × ۳۰ × ۸ سانتی‌متر",
      likes: 89,
      views: 567,
    },
    {
      id: 5,
      title: "تیزر تبلیغاتی هنرمند",
      category: "motion",
      type: "موشن گرافیک",
      year: "۱۴۰۲",
      client: "گالری هنری معاصر",
      description: "انیمیشن تبلیغاتی برای معرفی هنرمند معاصر ایرانی",
      fullDescription:
        "موشن گرافیک ۶۰ ثانیه‌ای با ترکیب هنر دیجیتال و انیمیشن سنتی. استفاده از تکنیک روتوسکوپی برای آثار هنری.",
      image: "cover2.JPG",
      awards: ["جایزه بهترین موشن دیزاین"],
      tools: ["After Effects", "Cinema 4D", "Premiere Pro"],
      dimensions: "۱۹۲۰ × ۱۰۸۰",
    },
    {
      id: 6,
      title: "پوستر جشنواره فیلم",
      category: "poster",
      type: "پوستر سینمایی",
      year: "۱۳۹۸",
      client: "جشنواره فیلم فجر",
      description: "طراحی پوستر رسمی سی و هشتمین جشنواره فیلم فجر",
      fullDescription:
        "پوستر اصلی جشنواره با مفهوم نور و سینما. استفاده از نمادهای سینمایی در قالب طراحی مدرن مینیمال.",
      image: "cover3.JPG",
      awards: ["نشان طلای جشنواره"],
      dimensions: "۵۰ × ۷۰ سانتی‌متر",
    },
  ];

  const filteredItems =
    activeCategory === "all"
      ? designItems
      : designItems.filter((item) => item.category === activeCategory);

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}

      <div className="relative overflow-hidden bg-gray-700 pb-5">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('/cover.JPG')] bg-cover bg-center z-0" />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70 z-10" />

        {/* Content */}
        <div className="container mx-auto px-4 py-20 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              دنیای طراحی گرافیک
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
              از پوسترهای مفهومی تا برندینگ حرفه‌ای - مروری بر آثار گرافیکی
              <span className="text-gray-300 font-semibold">
                {" "}
                حمیدرضا خواجه محمدی
              </span>
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <div className=" backdrop-blur-sm px-8 py-4 rounded-2xl  border-white/20">
                <div className="text-3xl font-bold">۲۵+</div>
                <div className="text-sm opacity-90">سال تجربه</div>
              </div>
              <div className=" backdrop-blur-sm px-8 py-4 rounded-2xl  border-white/20">
                <div className="text-3xl font-bold">۲۰۰+</div>
                <div className="text-sm opacity-90">پروژه موفق</div>
              </div>
              <div className=" backdrop-blur-sm px-8 py-4 rounded-2xl  border-white/20">
                <div className="text-3xl font-bold">۱۵+</div>
                <div className="text-sm opacity-90">جایزه ملی</div>
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

      {/* Introduction */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
              هنر گرافیک، زبان بصری عصر مدرن
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-12">
              طراحی گرافیک هنر برقراری ارتباط بصری است. در این مجموعه، شاهد
              تلفیق هنر سنتی ایرانی با تکنولوژی روز طراحی هستید. هر پروژه
              داستانی منحصربه‌فرد از چالش، خلاقیت و نتیجه نهایی است.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 pb-12">
        <div className="mb-12">
          {/* Category Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`relative px-6 py-3 group font-medium cursor-pointer transition-colors duration-300
      ${
        activeCategory === category.id
          ? "text-cyan-600"
          : "text-gray-600 hover:text-cyan-600"
      }`}
              >
                <div className="font-bold ">{category.label}</div>

                <span
                  className={`absolute right-0 -bottom-1 h-[2px] w-full bg-cyan-600 transform transition-transform duration-500
        ${
          activeCategory === category.id
            ? "scale-x-100 origin-right"
            : "scale-x-0 origin-left group-hover:scale-x-100 group-hover:origin-right"
        }`}
                />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Design Items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + viewMode}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                : "space-y-6"
            }
          >
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                layout
                className={`group relative ${
                  viewMode === "grid"
                    ? "bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
                    : "bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                }`}
                onClick={() => openModal(item)}
              >
                <>
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
                    <div
                      className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-110 transition-transform duration-700"
                      style={{
                        backgroundImage: `url(${item.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-center">
                        <ZoomIn className="w-12 h-12 text-white mx-auto mb-2" />
                        <p className="text-white font-medium">مشاهده جزئیات</p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-cyan-600 transition-colors line-clamp-1">
                      {item.title}
                    </h3>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {item.year}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {item.type}
                      </span>
                    </div>

                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🎨</div>
            <p className="text-gray-500 text-xl">
              هنوز اثری در این دسته‌بندی ثبت نشده است.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={closeModal}
            />

            {/* Modal Content */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
                className="relative bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-6 left-6 z-50 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all duration-300"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Modal Header */}
                <div className="p-6 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        {selectedItem.title}
                      </h2>
                      <p className="text-gray-600">
                        برای {selectedItem.client} • {selectedItem.year}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="grid lg:grid-cols-2 p-6 gap-0 h-full">
                  {/* Main Image */}
                  <div className="lg:col-span-1 relative min-h-[400px] lg:min-h-[350px]">
                    <div>
                      <img
                        src={selectedItem.image}
                        alt={selectedItem.title}
                        className="h-[350px] w-auto"
                      />
                    </div>
                  </div>

                  {/* Details Sidebar */}
                  <div className="p-8 overflow-y-auto">
                    <div className="space-y-8">
                      {/* Description */}
                      <div>
                        <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <BookOpen className="w-6 h-6 text-amber-600" />
                          توضیحات پروژه
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {selectedItem.fullDescription}
                        </p>
                      </div>

                      {/* Specifications */}
                      <div className="space-y-4">
                        <h4 className="text-xl font-bold text-gray-800 mb-4">
                          مشخصات فنی
                        </h4>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-5 h-5 text-amber-600" />
                              <span className="font-bold text-gray-700">
                                سال تولید
                              </span>
                            </div>
                            <p className="text-gray-800">{selectedItem.year}</p>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                              <Palette className="w-5 h-5 text-amber-600" />
                              <span className="font-bold text-gray-700">
                                ابعاد
                              </span>
                            </div>
                            <p className="text-gray-800">
                              {selectedItem.dimensions}
                            </p>
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

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default GeraphicPage;
