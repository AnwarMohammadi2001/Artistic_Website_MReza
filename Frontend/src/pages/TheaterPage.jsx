import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Users, X, ZoomIn, Clock } from "lucide-react";

const TheaterPage = () => {
  const [selectedExhibition, setSelectedExhibition] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columns, setColumns] = useState(3);
  const [imageDimensions, setImageDimensions] = useState({});

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

  // داده‌های نمایشگاه‌ها با سایزهای واقعی تصاویر
  const exhibitions = [
    {
      id: 1,
      title: "چهل سال خلاقیت",
      image: "th/1.jpg",
      year: "۱۴۰۰",
      date: "۱۴۰۰/۰۶/۱۵ تا ۱۴۰۰/۰۷/۱۵",
      location: "موزه هنرهای معاصر تهران",
      organizer: "انجمن هنرمندان ایران",
      description: "نمایشگاه مروری بر چهار دهه فعالیت هنری حمیدرضا خواجه محمدی",
      fullDescription:
        "این نمایشگاه که به مناسبت چهل‌سالگی فعالیت هنری برگزار شد، شامل بیش از ۵۰ اثر از دوره‌های مختلف کاری هنرمند بود. آثار شامل نقاشی، طراحی، گرافیک و تلفیق مواد مختلف می‌شد.",
      duration: "۳۰ روز",
      visitors: "۲۵۰۰ نفر",
      featured: true,
    },
    {
      id: 2,
      title: "نقاشی خط معاصر",
      image: "th/2.JPG",
      year: "۱۳۹۸",
      date: "۱۳۹۸/۰۸/۱۰ تا ۱۳۹۸/۰۹/۱۰",
      location: "گالری سیحون، تهران",
      organizer: "خانه هنرمندان",
      description: "نمایشگاه گروهی هنرمندان پیشگام نقاشی خط",
      fullDescription:
        "نمایشگاهی از آثار برجسته هنرمندان نقاشی خط ایران که تحولات این هنر در دهه‌های اخیر را به نمایش گذاشت.",
      duration: "۳۰ روز",
      visitors: "۱۸۰۰ نفر",
    },
    {
      id: 3,
      title: "هنر ایرانی در پاریس",
      image: "th/3.jpg",
      year: "۱۳۹۶",
      date: "۱۳۹۶/۰۳/۱۵ تا ۱۳۹۶/۰۴/۱۵",
      location: "گالری کارتیه، پاریس",
      organizer: "وزارت فرهنگ فرانسه",
      description: "نمایشگاه بین‌المللی هنر معاصر ایران",
      fullDescription:
        "این نمایشگاه که با همکاری موزه لوور برگزار شد، آثار هنرمندان ایرانی را در قلب پاریس به نمایش گذاشت.",
      duration: "۳۰ روز",
      visitors: "۵۰۰۰ نفر",
    },
    {
      id: 4,
      title: "مینیاتورهای مدرن",
      image: "th/4.jpg",
      year: "۱۳۹۹",
      date: "۱۳۹۹/۱۱/۲۰ تا ۱۳۹۹/۱۲/۲۰",
      location: "نگارخانه تهران",
      organizer: "فرهنگستان هنر",
      description: "تلفیق هنر مینیاتور با تکنیک‌های مدرن",
      fullDescription:
        "آثار این نمایشگاه نشان‌دهنده نوآوری در هنر مینیاتور با استفاده از مواد و تکنیک‌های معاصر بود.",
      duration: "۳۰ روز",
      visitors: "۲۰۰۰ نفر",
    },
    {
      id: 5,
      title: "طراحی و گرافیک",
      image: "th/5.JPG",
      year: "۱۴۰۱",
      date: "۱۴۰۱/۰۴/۰۵ تا ۱۴۰۱/۰۵/۰۵",
      location: "موزه طراحی گرافیک",
      organizer: "انجمن طراحان ایران",
      description: "نمایشگاه آثار برجسته طراحی و گرافیک",
      fullDescription:
        "نمایشگاهی از بهترین آثار طراحی گرافیک سه دهه اخیر ایران با تمرکز بر آثار مفهومی و تجربی.",
      duration: "۳۰ روز",
      visitors: "۳۰۰۰ نفر",
    },
    {
      id: 6,
      title: "طبیعت و انتزاع",
      image: "th/7.jpg",
      year: "۱۴۰۲",
      date: "۱۴۰۲/۰۲/۱۰ تا ۱۴۰۲/۰۳/۱۰",
      location: "گالری ویلا، اصفهان",
      organizer: "استانداری اصفهان",
      description: "آثار انتزاعی با الهام از طبیعت ایران",
      fullDescription:
        "این نمایشگاه که در شهر تاریخی اصفهان برگزار شد، تأثیر طبیعت ایران بر هنر انتزاعی را بررسی کرد.",
      duration: "۲۸ روز",
      visitors: "۲۲۰۰ نفر",
    },
    {
      id: 7,
      title: "هنر دیجیتال",
      image: "th/8.JPG",
      year: "۱۴۰۰",
      date: "۱۴۰۰/۰۹/۰۱ تا ۱۴۰۰/۱۰/۰۱",
      location: "مرکز هنرهای دیجیتال",
      organizer: "شرکت فناوری هنر",
      description: "نمایشگاه هنر دیجیتال و تعاملی",
      fullDescription:
        "اولین نمایشگاه بزرگ هنر دیجیتال در ایران با آثار تعاملی و تکنولوژی‌های جدید.",
      duration: "۳۰ روز",
      visitors: "۳۵۰۰ نفر",
    },
    {
      id: 8,
      title: "نمایشگاه دبی",
      image: "th/9.jpg",
      year: "۱۳۹۷",
      date: "۱۳۹۷/۱۰/۱۵ تا ۱۳۹۷/۱۱/۱۵",
      location: "مرکز تجارت جهانی دبی",
      organizer: "دولت دبی",
      description: "نمایشگاه هنر معاصر خاورمیانه",
      fullDescription:
        "نمایشگاهی بین‌المللی که هنرمندان برجسته خاورمیانه را گرد هم آورد.",
      duration: "۳۰ روز",
      visitors: "۸۰۰۰ نفر",
    },
    {
      id: 9,
      title: "نقاشی‌های بزرگ",
      image: "th/10.JPG",
      year: "۱۳۹۵",
      date: "۱۳۹۵/۰۵/۲۰ تا ۱۳۹۵/۰۶/۲۰",
      location: "تالار وحدت تهران",
      organizer: "وزارت فرهنگ و ارشاد اسلامی",
      description: "نمایشگاه آثار بزرگ مقیاس",
      fullDescription:
        "آثار بزرگ مقیاسی که برای اولین بار در فضای عمومی به نمایش درآمدند.",
      duration: "۳۰ روز",
      visitors: "۴۰۰۰ نفر",
    },
    {
      id: 10,
      title: "جوانان و هنر",
      image: "ex/10.JPG",
      year: "۱۴۰۲",
      date: "۱۴۰۲/۰۷/۰۱ تا ۱۴۰۲/۰۸/۰۱",
      location: "دانشگاه هنر تهران",
      organizer: "دانشگاه هنر",
      description: "نمایشگاه آثار دانشجویان و هنرمندان جوان",
      fullDescription:
        "نمایشگاهی برای معرفی استعدادهای جوان هنر ایران با مربیگری هنرمندان پیشکسوت.",
      duration: "۳۰ روز",
      visitors: "۲۸۰۰ نفر",
    },
  ];

  // تابع برای اندازه‌گیری سایز واقعی تصاویر
  useEffect(() => {
    const loadImageDimensions = async () => {
      const dimensions = {};

      for (const exhibition of exhibitions) {
        try {
          await new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              // محاسبه نسبت ابعاد تصویر
              const aspectRatio = img.width / img.height;
              dimensions[exhibition.id] = {
                width: img.width,
                height: img.height,
                aspectRatio: aspectRatio,
                // تعیین ارتفاع بر اساس نسبت ابعاد
                heightClass:
                  aspectRatio > 1.5
                    ? "h-64" // landscape
                    : aspectRatio < 0.8
                    ? "h-96" // portrait
                    : "h-80", // square
              };
              resolve();
            };
            img.onerror = () => {
              dimensions[exhibition.id] = {
                width: 800,
                height: 600,
                aspectRatio: 1.33,
                heightClass: "h-80",
              };
              resolve();
            };
            img.src = exhibition.image;
          });
        } catch (error) {
          console.log(`خطا در بارگذاری تصویر ${exhibition.id}:`, error);
        }
      }

      setImageDimensions(dimensions);
    };

    loadImageDimensions();
  }, []);

  // تابع برای ساخت Masonry Layout با سایز واقعی تصاویر
  const createMasonryColumns = () => {
    const columnArrays = Array.from({ length: columns }, () => []);
    const columnHeights = Array(columns).fill(0);

    exhibitions.forEach((item) => {
      const dimension = imageDimensions[item.id];
      let itemHeight = 400; // مقدار پیش‌فرض

      if (dimension) {
        // محاسبه ارتفاع بر اساس نسبت ابعاد واقعی
        itemHeight =
          dimension.aspectRatio > 1.5
            ? 300 // landscape کوتاه
            : dimension.aspectRatio < 0.8
            ? 500 // portrait بلند
            : 400; // square متوسط
      }

      // پیدا کردن کوتاه‌ترین ستون
      const shortestColumnIndex = columnHeights.indexOf(
        Math.min(...columnHeights)
      );
      columnArrays[shortestColumnIndex].push(item);
      columnHeights[shortestColumnIndex] += itemHeight;
    });

    return columnArrays;
  };

  const openModal = (exhibition) => {
    setSelectedExhibition(exhibition);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExhibition(null);
    document.body.style.overflow = "auto";
  };

  const masonryColumns = createMasonryColumns();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      {/* Masonry Grid نمایشگاه‌ها */}
      <div className="mx-auto">
        <div>
          {exhibitions.length > 0 ? (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {masonryColumns.map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col gap-6">
                  {column.map((exhibition) => (
                    <motion.div
                      key={exhibition.id}
                      layout
                      className="group relative cursor-pointer overflow-hidden rounded-md shadow-xl hover:shadow-2xl transition-all duration-500"
                      onClick={() => openModal(exhibition)}
                      style={{
                        // استفاده از کلاس ارتفاع بر اساس نسبت تصویر
                        height: imageDimensions[exhibition.id]?.heightClass
                          ? "auto"
                          : "400px",
                        minHeight: "300px",
                      }}
                    >
                      {/* Container با نسبت ابعاد طبیعی */}
                      <div className="relative w-full h-full">
                        {/* تصویر نمایشگاه */}
                        <div className="absolute inset-0">
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300">
                            <img
                              src={exhibition.image}
                              alt={exhibition.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              loading="lazy"
                              style={{
                                objectPosition: "center",
                              }}
                            />
                          </div>

                          {/* گرادیان Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        </div>

                        {/* اطلاعات پایه (همیشه نمایش داده می‌شود) */}
                        <div className="absolute bottom-4 right-4 left-4">
                          <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
                            {exhibition.title}
                          </h3>
                          <div className="flex items-center justify-between text-white/90 text-sm">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">
                                {exhibition.location.split("،")[0]}
                              </span>
                            </div>
                            <span className="font-bold">{exhibition.year}</span>
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
              <div className="text-6xl mb-6 opacity-50">🏛️</div>
              <p className="text-gray-500 text-xl">
                در حال بارگذاری نمایشگاه‌ها...
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modal جزئیات نمایشگاه */}
      <AnimatePresence>
        {isModalOpen && selectedExhibition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeModal}
            />

            {/* Modal Content */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
                className="relative bg-white rounded-md shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
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
                      src={selectedExhibition.image}
                      alt={selectedExhibition.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <div className="text-white">
                        <div className="text-sm opacity-90">سال برگزاری</div>
                        <div className="text-2xl font-bold">
                          {selectedExhibition.year}
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
                        {selectedExhibition.title}
                      </h2>
                      <p className="text-gray-600 text-lg">
                        {selectedExhibition.description}
                      </p>
                    </div>

                    {/* جزئیات */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* ستون اول */}
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-bold text-gray-700 mb-1">
                              تاریخ برگزاری
                            </div>
                            <div className="text-gray-600">
                              {selectedExhibition.date}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-bold text-gray-700 mb-1">
                              مکان نمایشگاه
                            </div>
                            <div className="text-gray-600">
                              {selectedExhibition.location}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Users className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-bold text-gray-700 mb-1">
                              برگزارکننده
                            </div>
                            <div className="text-gray-600">
                              {selectedExhibition.organizer}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ستون دوم */}
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-bold text-gray-700 mb-1">
                              مدت زمان
                            </div>
                            <div className="text-gray-600">
                              {selectedExhibition.duration}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Users className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-bold text-gray-700 mb-1">
                              تعداد بازدیدکنندگان
                            </div>
                            <div className="text-gray-600">
                              {selectedExhibition.visitors}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* توضیحات کامل */}
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-xl font-bold text-gray-800 mb-4">
                        توضیحات کامل نمایشگاه
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedExhibition.fullDescription}
                      </p>
                    </div>

                    {/* اطلاعات اضافی */}
                    {selectedExhibition.featured && (
                      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">★</span>
                          </div>
                          <div>
                            <div className="font-bold text-gray-800">
                              نمایشگاه ویژه
                            </div>
                            <div className="text-gray-600 text-sm">
                              این نمایشگاه جزء نمایشگاه‌های شاخص هنرمند محسوب
                              می‌شود
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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
