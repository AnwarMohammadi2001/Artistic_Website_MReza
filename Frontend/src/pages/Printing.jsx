import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, ZoomIn, Calendar, User, Palette, Ruler, Info } from "lucide-react";

const Printing = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    { id: "all", label: "همه آثار", color: "bg-amber-500" },
    { id: "humanRights", label: "حقوق بشری", color: "bg-blue-500" },
    { id: "islamic", label: "نقاشی اسلامی", color: "bg-emerald-500" },
    { id: "abstract", label: "انتزاعی", color: "bg-purple-500" },
    { id: "landscape", label: "طبیعت", color: "bg-green-500" },
  ];

  const paintings = [
    {
      id: 1,
      title: "فریاد سکوت",
      category: "humanRights",
      image: "12.jpg",
      year: "۱۳۸۵",
      dimensions: "۱۲۰ × ۸۰ سانتی‌متر",
      technique: "رنگ روغن روی بوم",
      description:
        "این اثر نمادی از اعتراض خاموش انسان‌های ستمدیده در برابر بی‌عدالتی است. ترکیب‌بندی متمرکز و رنگ‌های تیره بیانگر عمق رنج و امید به آینده‌ای روشن است.",
      fullDescription:
        "فریاد سکوت یکی از برجسته‌ترین آثار دوره فعالیت هنرمند در حوزه حقوق بشر است. این تابلو در سال ۱۳۸۵ و در اوج اتفاقات اجتماعی خلق شد. استفاده از رنگ‌های متضاد و خطوط شکسته، تضاد بین آرامش ظاهری و طوفان درونی سوژه را به تصویر می‌کشد. این اثر در نمایشگاه بین‌المللی ژنو در سال ۱۳۸۷ به نمایش درآمد و مورد توجه منتقدان بین‌المللی قرار گرفت.",
    },
    {
      id: 2,
      title: "رقص نور",
      category: "islamic",
      image: "25.JPG",
      year: "۱۳۹۰",
      dimensions: "۱۰۰ × ۷۰ سانتی‌متر",
      technique: "آبرنگ و طلاکاری",
      description:
        "تلفیق هنر اسلامی با نورپردازی مدرن، ایجاد کننده فضایی روحانی و معنوی.",
      fullDescription:
        "رقص نور نمونه‌ای شاخص از تلفیق هنر اسلامی با تکنیک‌های مدرن است. در این اثر از طلاکاری سنتی ایرانی در کنار تکنیک‌های آبرنگ مدرن استفاده شده است. بازی نور و سایه در این تابلو عمق معنوی خاصی ایجاد کرده است.",
    },
    {
      id: 3,
      title: "انعکاس",
      category: "abstract",
      image: "12.jpg",
      year: "۱۳۹۵",
      dimensions: "۱۵۰ × ۱۰۰ سانتی‌متر",
      technique: "اکریلیک روی کرباس",
      description:
        "آثار انتزاعی با رنگ‌های زنده و ترکیب‌بندی پویا که احساسات درونی هنرمند را بازتاب می‌دهد.",
      fullDescription:
        "انعکاس از مجموعه آثار انتزاعی دوره جدید هنرمند است. در این اثر تأثیر هنر مدرن غربی بر سنت‌های شرقی به وضوح قابل مشاهده است.",
    },
    {
      id: 4,
      title: "بهار خاموش",
      category: "landscape",
      image: "25.JPG",
      year: "۱۳۸۸",
      dimensions: "۹۰ × ۶۰ سانتی‌متر",
      technique: "رنگ روغن",
      description:
        "منظره‌ای آرام از طبیعت بکر ایران با توجه به جزئیات و نورپردازی طبیعی.",
      fullDescription:
        "بهار خاموش از نقاط قوت هنرمند در نقاشی منظره است. این اثر در منطقه جنگلی شمال ایران الهام گرفته شده و طبیعت بکر آن منطقه را به تصویر می‌کشد.",
    },
    {
      id: 5,
      title: "عدالت",
      category: "humanRights",
      image: "12.jpg",
      year: "۱۳۹۲",
      dimensions: "۱۳۰ × ۹۰ سانتی‌متر",
      technique: "ترکیب مواد",
      description:
        "نمادی از مبارزه برای برابری و عدالت اجتماعی با استفاده از نمادهای سنتی و مدرن.",
      fullDescription:
        "اثر عدالت در پی اتفاقات اجتماعی سال ۱۳۹۲ خلق شد. در این تابلو از مواد مختلفی از جمله خاک، رنگ روغن و طلا استفاده شده است.",
    },
    {
      id: 6,
      title: "معراج",
      category: "islamic",
      image: "25.JPG",
      year: "۱۴۰۰",
      dimensions: "۱۲۰ × ۸۰ سانتی‌متر",
      technique: "مینیاتور و طلاکاری",
      description:
        "بازآفرینی مدرن از مضامین عرفانی اسلامی با تکنیک‌های پیشرفته.",
      fullDescription:
        "معراج آخرین اثر هنرمند در حوزه نقاشی اسلامی است. در این تابلو از تکنیک‌های سنتی مینیاتور ایرانی در کنار تکنیک‌های مدرن دیجیتال استفاده شده است.",
    },
  ];

  const filteredPaintings =
    activeCategory === "all"
      ? paintings
      : paintings.filter((painting) => painting.category === activeCategory);

  const openModal = (painting) => {
    setSelectedPainting(painting);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPainting(null);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gray-300 pb-5  ">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl lg:text-4xl font-bold mb-4 leading-tight">
              گالری نقاشی‌های
              <span className="block text-amber-300 mt-2">
                حمیدرضا خواجه محمدی
              </span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-amber-100 leading-relaxed">
              مروری بر چهار دهه خلق آثار هنری در سبک‌های مختلف از نقاشی اسلامی
              تا هنر معاصر انتزاعی
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <div className=" backdrop-blur-sm px-6 py-3 rounded-full">
                <span className="font-bold text-2xl">۴۰+</span>
                <p className="text-sm">سال تجربه</p>
              </div>
              <div className=" backdrop-blur-sm px-6 py-3 rounded-full">
                <span className="font-bold text-2xl">۲۰۰+</span>
                <p className="text-sm">اثر هنری</p>
              </div>
              <div className=" backdrop-blur-sm px-6 py-3 rounded-full">
                <span className="font-bold text-2xl">۱۵+</span>
                <p className="text-sm">نمایشگاه بین‌المللی</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path d="M0,0V120H1200V0C800,80 400,80 0,0Z" fill="white" />
          </svg>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="container mx-auto px-4 ">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
            هنر نقاشی، زبان بی‌کلام احساسات
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-10">
            نقاشی‌های حمیدرضا خواجه محمدی تلفیقی است از سنت‌های کهن هنر ایرانی و
            نوآوری‌های معاصر. هر اثر روایتی است از زندگی، مبارزه، امید و زیبایی.
            از نقاشی‌های اسلامی با تکنیک طلاکاری سنتی تا آثار انتزاعی معاصر، همه
            نشان‌دهنده عمق نگاه و تسلط هنرمند بر سبک‌های مختلف است.
          </p>

          {/* Category Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`relative px-6 py-3 group font-medium cursor-pointer transition-colors duration-300
      ${
        activeCategory === category.id
          ? "text-amber-600"
          : "text-gray-600 hover:text-amber-600"
      }`}
              >
                {category.label}

                <span
                  className={`absolute right-0 -bottom-1 h-[2px] w-full bg-amber-500 transform transition-transform duration-500
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

      {/* Paintings Grid */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPaintings.map((painting) => (
            <motion.div
              key={painting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="group relative bg-white rounded-md shadow-md hover:shadow-lg transition-all duration-500 overflow-hidden cursor-pointer"
              onClick={() => openModal(painting)}
            >
              {/* Painting Image */}
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
                <div
                  className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"
                  style={{
                    backgroundImage: `url(${painting.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                {/* Category Badge */}\{/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                  <div className="transform translate-y-4 group-hover:translate-y-0 flex flex-col items-center transition-transform duration-300">
                    <ZoomIn className="w-12 h-12 text-white" />
                    <p className="text-white mt-2 font-medium">مشاهده جزئیات</p>
                  </div>
                </div>
              </div>

              {/* Painting Info */}
              <div className="p-6">
                <div className="flex items-center justify-between pb-2">
                  <h3 className="text-xl font-bold text-gray-800  group-hover:text-amber-700 transition-colors">
                    {painting.title}
                  </h3>
                  <div className="">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold text-amber-600 `}
                    >
                      {
                        categories.find((c) => c.id === painting.category)
                          ?.label
                      }
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {painting.description}
                </p>

                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{painting.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-gray-500" />
                    <span>{painting.dimensions}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-gray-500" />
                    <span>{painting.technique}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPaintings.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">
              هنوز اثری در این دسته‌بندی ثبت نشده است.
            </p>
          </div>
        )}
      </div>

      {/* Modal for Painting Details */}
      {isModalOpen && selectedPainting && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          ></div>

          {/* Modal Content */}
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-lg shadow-2xl max-w-6xl p-4 w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 left-4 z-50 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className=" gap-0 h-full">
                {/* Painting Image */}
                <div className="relative h-full grid grid-cols-2 gap-x-5  md:h-[350px]">
                  <img
                    src={selectedPainting.image}
                    alt={selectedPainting.title}
                    className="h-[350px]"
                  />
                  <div>
                    <div>
                      <span
                        className={`inline-block px-4 py-2 rounded-full text-sm font-bold text-amber-600 mb-4 `}
                      >
                        {
                          categories.find(
                            (c) => c.id === selectedPainting.category
                          )?.label
                        }
                      </span>
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        {selectedPainting.title}
                      </h2>
                    </div>

                    {/* Specifications */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-amber-50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-5 h-5 text-amber-600" />
                          <span className="font-bold text-gray-700">
                            سال خلق
                          </span>
                        </div>
                        <p className="text-gray-800">{selectedPainting.year}</p>
                      </div>

                      <div className="bg-amber-50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Ruler className="w-5 h-5 text-amber-600" />
                          <span className="font-bold text-gray-700">ابعاد</span>
                        </div>
                        <p className="text-gray-800">
                          {selectedPainting.dimensions}
                        </p>
                      </div>

                      <div className="bg-amber-50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Palette className="w-5 h-5 text-amber-600" />
                          <span className="font-bold text-gray-700">تکنیک</span>
                        </div>
                        <p className="text-gray-800">
                          {selectedPainting.technique}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Painting Details */}
                <div className="p-8 overflow-y-auto max-h-[600px]">
                  <div className="space-y-6">
                    {/* Header */}

                    {/* Full Description */}
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 mb-4">
                        توضیحات کامل اثر
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedPainting.fullDescription}
                      </p>
                    </div>

                    {/* Artist Signature */}
                    <div className="pt-6 border-t border-gray-200">
                      <div className="flex items-center gap-3">
                        <User className="w-6 h-6 text-amber-600" />
                        <div>
                          <p className="font-bold text-gray-800">
                            حمیدرضا خواجه محمدی
                          </p>
                          <p className="text-sm text-gray-600">
                            هنرمند و خالق اثر
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Printing;
