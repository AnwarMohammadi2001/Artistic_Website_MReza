import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Maximize2, Film, Image as ImageIcon } from "lucide-react";

const InterviewPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columns, setColumns] = useState(3);
  const [videoThumbnails, setVideoThumbnails] = useState({});
  const videoRefs = useRef({});

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

  // تابع برای ایجاد تامبنیل از ویدیو
  const generateThumbnail = (videoUrl, videoId) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.preload = "metadata";

      // وقتی متادیتا بارگذاری شد
      video.onloadedmetadata = () => {
        // به نقطه دلخواه از ویدیو برو (مثلاً ۲ ثانیه)
        video.currentTime = 2;
      };

      // وقتی فریم ویدیو بارگذاری شد
      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.7);
        resolve(thumbnailUrl);

        // Cleanup
        video.remove();
        canvas.remove();
      };

      video.onerror = () => {
        console.log("خطا در بارگذاری ویدیو:", videoUrl);
        resolve(null);
      };

      video.src = videoUrl;
    });
  };

  // تابع برای ایجاد تامبنیل از ویدیو با کَش
  const getVideoThumbnail = async (videoUrl, videoId) => {
    try {
      // بررسی وجود تامبنیل در کش
      const cacheKey = `thumbnail_${videoId}`;
      const cachedThumbnail = localStorage.getItem(cacheKey);

      if (cachedThumbnail) {
        return cachedThumbnail;
      }

      // ایجاد تامبنیل جدید
      const thumbnail = await generateThumbnail(videoUrl, videoId);

      if (thumbnail) {
        // ذخیره در کش
        localStorage.setItem(cacheKey, thumbnail);
        return thumbnail;
      }

      return null;
    } catch (error) {
      console.error("خطا در ایجاد تامبنیل:", error);
      return null;
    }
  };

  const filters = [
    { id: "all", label: "همه", count: 9, icon: <Film className="w-5 h-5" /> },
    {
      id: "image",
      label: "تصاویر",
      count: 6,
      icon: <ImageIcon className="w-5 h-5" />,
    },
    {
      id: "video",
      label: "ویدیوها",
      count: 3,
      icon: <Play className="w-5 h-5" />,
    },
  ];

  // داده‌های واقعی شما با اندازه‌های مختلف
  const mediaItems = [
    {
      id: 1,
      type: "image",
      src: "in/IMG_5291.JPG",
      title: "مصاحبه با مجله هنر معاصر",
      aspectRatio: "landscape",
    },
    {
      id: 2,
      type: "video",
      src: "in/مصاحبه با ایران انتر نشنال.mp4",
      title: "مصاحبه با شبکه ایران اینترنشنال",
      aspectRatio: "portrait",
    },
    {
      id: 3,
      type: "image",
      src: "in/IMG_5317.JPG",
      title: "مصاحبه با روزنامه شرق",
      aspectRatio: "square",
    },
    {
      id: 4,
      type: "image",
      src: "in/IMG_5621.JPG",
      title: "مصاحبه رادیویی",
      aspectRatio: "landscape",
    },
    {
      id: 5,
      type: "image",
      src: "in/IMG_5291.JPG",
      title: "مصاحبه دیگر",
      aspectRatio: "portrait",
    },
    {
      id: 6,
      type: "video",
      src: "in/مصاحبه دیگر.mp4",
      title: "کارگاه آموزشی",
      aspectRatio: "landscape",
    },
    {
      id: 7,
      type: "image",
      src: "in/IMG_5317.JPG",
      title: "ویژه‌نامه نوروزی",
      aspectRatio: "square",
    },
    {
      id: 8,
      type: "image",
      src: "in/IMG_5621.JPG",
      title: "گزارش گاردین",
      aspectRatio: "portrait",
    },
    {
      id: 9,
      type: "video",
      src: "in/مصاحبه تلویزیونی.mp4",
      title: "برنامه هنر و اندیشه",
      aspectRatio: "landscape",
    },
  ];

  // ایجاد تامبنیل برای ویدیوها
  useEffect(() => {
    const loadThumbnails = async () => {
      const thumbnails = {};
      const videoItems = mediaItems.filter((item) => item.type === "video");

      for (const videoItem of videoItems) {
        const thumbnail = await getVideoThumbnail(videoItem.src, videoItem.id);
        if (thumbnail) {
          thumbnails[videoItem.id] = thumbnail;
        }
      }

      setVideoThumbnails(thumbnails);
    };

    loadThumbnails();
  }, []);

  const filteredItems =
    activeFilter === "all"
      ? mediaItems
      : mediaItems.filter((item) => item.type === activeFilter);

  // تابع برای ساخت Masonry Layout
  const createMasonryColumns = () => {
    const columnArrays = Array.from({ length: columns }, () => []);
    const columnHeights = Array(columns).fill(0);

    // محاسبه ارتفاع تقریبی هر آیتم بر اساس aspect ratio
    filteredItems.forEach((item) => {
      let itemHeight;
      switch (item.aspectRatio) {
        case "portrait":
          itemHeight = 400 + Math.random() * 100;
          break;
        case "landscape":
          itemHeight = 250 + Math.random() * 80;
          break;
        case "square":
          itemHeight = 300 + Math.random() * 60;
          break;
        default:
          itemHeight = 300;
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* هدر */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 bordre-b-4 border-blue-400 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              آرشیو تصاویر و ویدیوهای مصاحبه
            </h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              مجموعه‌ای از بهترین لحظات گفتگوهای حمیدرضا خواجه محمدی با
              رسانه‌های داخلی و بین‌المللی
            </p>
          </motion.div>
        </div>
      </div>

      {/* فیلترها */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
        <div className="flex flex-wrap  justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`relative  flex items-center gap-2 px-6 py-3 group rounded-full font-medium transition-all duration-300 ${
                activeFilter === filter.id
                  ? "text-amber-600"
                  : "text-gray-600 hover:text-amber-600"
              }`}
            >
              <span>{filter.label}</span>
              <span
                className={`absolute right-0 -bottom-1 h-[2px] w-full bg-amber-500 transform transition-transform duration-500
        ${
          activeFilter === filter.id
            ? "scale-x-100 origin-right"
            : "scale-x-0 origin-left group-hover:scale-x-100 group-hover:origin-right"
        }`}
              />
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <AnimatePresence mode="wait">
          {filteredItems.length > 0 ? (
            <motion.div
              key={activeFilter + columns}
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
                      transition={{ duration: 0.5, delay: item.id * 0.05 }}
                      className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
                      onClick={() => openModal(item)}
                      style={{
                        minHeight:
                          item.aspectRatio === "portrait"
                            ? "450px"
                            : item.aspectRatio === "landscape"
                            ? "280px"
                            : "320px",
                      }}
                    >
                      {/* Media Container */}
                      <div className="relative w-full h-full">
                        {item.type === "video" ? (
                          <>
                            {/* Video Thumbnail Container */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800">
                              {videoThumbnails[item.id] ? (
                                <img
                                  src={videoThumbnails[item.id]}
                                  alt={item.title}
                                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                                  loading="lazy"
                                />
                              ) : (
                                // Loading State
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900/30 to-indigo-900/30">
                                  <div className="relative mb-4">
                                    <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center">
                                      <Play
                                        className="w-10 h-10 text-white"
                                        fill="currentColor"
                                      />
                                    </div>
                                    <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-ping"></div>
                                  </div>
                                  <p className="text-white/70 text-sm">
                                    در حال بارگذاری تامبنیل...
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Play Button Center */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-300 opacity-0 group-hover:opacity-100">
                                <Play
                                  className="w-10 h-10 text-white"
                                  fill="currentColor"
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          // Image Container
                          <>
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300">
                              <img
                                src={item.src}
                                alt={item.title}
                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                loading="lazy"
                              />
                            </div>
                          </>
                        )}
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
              <div className="text-6xl mb-6 opacity-50">📷</div>
              <p className="text-gray-500 text-xl">موردی یافت نشد.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal برای نمایش بزرگ */}
      <AnimatePresence>
        {isModalOpen && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <div
              className="fixed inset-0 bg-black/95 backdrop-blur-sm"
              onClick={closeModal}
            />

            <div className="relative min-h-screen flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
                className="relative w-full max-w-6xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-50 w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors group"
                >
                  <X className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                </button>

                {/* Media Container */}
                <div className="relative rounded-3xl overflow-hidden bg-black shadow-2xl">
                  {selectedItem.type === "video" ? (
                    <div className="relative">
                      <video
                        key={selectedItem.id}
                        controls
                        autoPlay
                        className="w-full max-h-[80vh]"
                        poster={videoThumbnails[selectedItem.id] || ""}
                        controlsList="nodownload"
                      >
                        <source src={selectedItem.src} type="video/mp4" />
                        مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
                      </video>
                      <div className="absolute bottom-6 left-6 bg-gradient-to-r from-black/70 to-transparent text-white p-4 rounded-2xl backdrop-blur-sm">
                        <h3 className="text-xl font-bold mb-1">
                          {selectedItem.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                          <Play className="w-4 h-4" />
                          <span>ویدیو مصاحبه</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={selectedItem.src}
                        alt={selectedItem.title}
                        className="w-full max-h-[80vh] object-contain"
                      />
                      <div className="absolute bottom-6 left-6 bg-gradient-to-r from-black/70 to-transparent text-white p-4 rounded-2xl backdrop-blur-sm">
                        <h3 className="text-xl font-bold mb-1">
                          {selectedItem.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                          <Maximize2 className="w-4 h-4" />
                          <span>تصویر مصاحبه</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Hint */}
                <div className="mt-8 text-center">
                  <p className="text-gray-400 text-sm">
                    برای بستن، روی خارج از تصویر کلیک کنید یا دکمه × را فشار
                    دهید
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* استایل برای انیمیشن */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .shimmer-effect {
          position: relative;
          overflow: hidden;
        }

        .shimmer-effect::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default InterviewPage;
