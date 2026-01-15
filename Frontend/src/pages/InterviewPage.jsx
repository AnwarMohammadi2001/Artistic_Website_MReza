import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Film, Image as ImageIcon } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

const InterviewPage = () => {
  /* ================= STATES ================= */
  const [loading, setLoading] = useState(true);
  const [allProjects, setAllProjects] = useState([]);
  const [interviewProjects, setInterviewProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeSub, setActiveSub] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoThumbnails, setVideoThumbnails] = useState({});
  const [subCategories, setSubCategories] = useState([]);

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

      // فیلتر برای دسته‌بندی "مصاحبه"
      const interviews = projects.filter((p) => {
        if (!p.Category || !p.Category.title) return false;

        const categoryTitle = p.Category.title.toLowerCase().trim();
        const possibleNames = [
          "مصاحبه",
          "interview",
          "interviews",
          "گفتگو",
          "صحبت",
          "media",
          "رسانه",
          "تلویزیون",
          "رادیو",
          "گفت‌وگو",
          "گفت‌گو",
        ];

        return possibleNames.some((name) => categoryTitle.includes(name));
      });

      console.log("Filtered interview projects:", interviews);

      // مپ کردن پروژه‌ها به فرمت مدیا
      const mappedInterviews = interviews.map((project) => {
        // تعیین نوع مدیا
        let type = "image"; // پیش‌فرض
        if (
          project.mediaType === "video" ||
          project.link?.includes("video") ||
          project.link?.includes("youtube") ||
          project.link?.includes(".mp4") ||
          project.link?.includes(".mov") ||
          project.link?.includes(".avi")
        ) {
          type = "video";
        } else if (project.mediaType === "image" || project.mainImage) {
          type = "image";
        }

        // ساخت URL تصویر/ویدیو
        const getMediaUrl = () => {
          if (type === "video") {
            return project.link || project.mainImage;
          } else {
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
            return null;
          }
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
          // تصادفی انتخاب کن برای نمایش زیباتر
          const ratios = ["portrait", "landscape", "square"];
          return ratios[Math.floor(Math.random() * ratios.length)];
        };

        return {
          ...project,
          type: type,
          src: getMediaUrl(),
          aspectRatio: getAspectRatio(),
          displayTitle: project.title || "بدون عنوان",
          displayDescription:
            project.description || project.fullDescription || "بدون توضیحات",
          displayYear:
            project.date ||
            new Date(project.createdAt).getFullYear().toString() ||
            "نامشخص",
          displayOrganizer:
            project.organizer || project.exhibitionName || "نامشخص",
          mediaType: type,
        };
      });

      setInterviewProjects(mappedInterviews);
      setFilteredProjects(mappedInterviews);
      setAllProjects(projects);

      // استخراج زیردسته‌های منحصر به فرد
      const subs = mappedInterviews
        .map((p) => p.SubCategory)
        .filter((s) => s && (s.id || s.title));

      const uniqueSubs = Array.from(
        new Map(
          subs.map((s) => [s.id ? `id-${s.id}` : `title-${s.title}`, s])
        ).values()
      );

      console.log("Extracted Subcategories:", uniqueSubs);
      setSubCategories(uniqueSubs);

      // فعال کردن "همه" به صورت پیش‌فرض
      setActiveSub(null);

      // اگر ویدیو وجود دارد، تامبنیل بساز
      const videoItems = mappedInterviews.filter(
        (item) => item.type === "video"
      );
      if (videoItems.length > 0) {
        loadVideoThumbnails(videoItems);
      }
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER BY SUB CATEGORY ================= */
  const handleSubCategory = (sub) => {
    const key = sub?.id || sub?.title;
    setActiveSub(key);

    if (key === null) {
      setFilteredProjects(interviewProjects);
      return;
    }

    const filtered = interviewProjects.filter((item) => {
      if (!item.SubCategory) return false;

      if (sub.id) {
        return item.SubCategory.id === sub.id;
      }

      return item.SubCategory.title === sub.title;
    });

    setFilteredProjects(filtered);
  };

  const showAllItems = () => {
    setActiveSub(null);
    setFilteredProjects(interviewProjects);
  };

  /* ================= VIDEO THUMBNAIL GENERATION ================= */
  const loadVideoThumbnails = async (videoItems) => {
    const thumbnails = {};

    for (const item of videoItems) {
      if (item.src) {
        try {
          const thumbnail = await generateVideoThumbnail(item.src, item.id);
          if (thumbnail) {
            thumbnails[item.id] = thumbnail;
          }
        } catch (error) {
          console.error(
            `Error generating thumbnail for video ${item.id}:`,
            error
          );
        }
      }
    }

    setVideoThumbnails(thumbnails);
  };

  const generateVideoThumbnail = (videoUrl, videoId) => {
    return new Promise((resolve) => {
      // برای ویدیوهای آنلاین (یوتیوب، ویمو و غیره) نمی‌توانیم تامبنیل ایجاد کنیم
      // فقط برای ویدیوهای مستقیم
      if (
        !videoUrl ||
        videoUrl.includes("youtube") ||
        videoUrl.includes("vimeo") ||
        !videoUrl.includes("http")
      ) {
        resolve(null);
        return;
      }

      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        if (video.duration > 0) {
          video.currentTime = Math.min(2, video.duration * 0.1);
        } else {
          resolve(null);
        }
      };

      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;

        const ctx = canvas.getContext("2d");
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve(thumbnailUrl);
        } else {
          resolve(null);
        }

        video.remove();
        canvas.remove();
      };

      video.onerror = () => {
        console.log("خطا در بارگذاری ویدیو:", videoUrl);
        resolve(null);
        video.remove();
      };

      video.src = videoUrl + "?t=2";
    });
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
        <div className="absolute inset-0 bg-[url('/cover.JPG')] bg-cover bg-center z-0" />
        <div className="absolute inset-0 bg-black/70 z-10" />

        <div className="container mx-auto px-4 py-20 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              آرشیو تصاویر و ویدیوهای مصاحبه
            </h1>
            <p className="text-xl text-cyan-300 max-w-3xl mx-auto">
              مجموعه‌ای از بهترین لحظات گفتگوهای حمیدرضا خواجه محمدی با
              رسانه‌های داخلی و بین‌المللی
            </p>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap justify-center gap-6">
              <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl">
                <div className="text-3xl font-bold">
                  {interviewProjects.length}+
                </div>
                <div className="text-sm opacity-90">مصاحبه و گفتگو</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl">
                <div className="text-3xl font-bold">
                  {
                    interviewProjects.filter((item) => item.type === "video")
                      .length
                  }
                  +
                </div>
                <div className="text-sm opacity-90">ویدیوی مصاحبه</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl">
                <div className="text-3xl font-bold">
                  {
                    interviewProjects.filter((item) => item.type === "image")
                      .length
                  }
                  +
                </div>
                <div className="text-sm opacity-90">تصویر مصاحبه</div>
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

      {/* ================= SUBCATEGORY FILTERS ================= */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              {/* دکمه "همه" */}
              <button
                onClick={showAllItems}
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

              {/* زیردسته‌ها */}
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

          {/* ================= MEDIA GRID ================= */}
          <AnimatePresence mode="wait">
            {filteredProjects.length > 0 ? (
              <motion.div
                key={activeSub}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProjects.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    layout
                    className={`group relative cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 ${
                      item.aspectRatio === "portrait"
                        ? "row-span-2"
                        : item.aspectRatio === "landscape"
                        ? "col-span-1"
                        : "col-span-1"
                    }`}
                    onClick={() => openModal(item)}
                    style={{
                      minHeight:
                        item.aspectRatio === "portrait"
                          ? "500px"
                          : item.aspectRatio === "landscape"
                          ? "300px"
                          : "350px",
                    }}
                  >
                    {/* Media Container */}
                    <div className="relative w-full h-full">
                      {item.type === "video" ? (
                        <>
                          {/* Video Thumbnail */}
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800">
                            {videoThumbnails[item.id] ? (
                              <img
                                src={videoThumbnails[item.id]}
                                alt={item.displayTitle}
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900/30 to-indigo-900/30">
                                <div className="relative mb-4">
                                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                                    <Play className="w-8 h-8 text-white" />
                                  </div>
                                </div>
                                <p className="text-white/70 text-sm">
                                  ویدیو مصاحبه
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Play Button */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-300 opacity-0 group-hover:opacity-100">
                              <Play className="w-8 h-8 text-white" />
                            </div>
                          </div>

                          {/* Title Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            <h3 className="text-white font-bold text-lg line-clamp-1">
                              {item.displayTitle}
                            </h3>
                            <p className="text-gray-300 text-sm">
                              {item.displayYear} • {item.displayOrganizer}
                            </p>
                            {item.SubCategory && (
                              <span className="inline-block mt-2 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                                {item.SubCategory.title}
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Image */}
                          {item.src ? (
                            <img
                              src={item.src}
                              alt={item.displayTitle}
                              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                              loading="lazy"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.parentElement.innerHTML = `
                                  <div class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex flex-col items-center justify-center p-4">
                                    <div class="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                                      <ImageIcon class="w-8 h-8 text-gray-500" />
                                    </div>
                                    <p class="text-gray-500">تصویر مصاحبه</p>
                                    ${
                                      item.SubCategory
                                        ? `<span class="mt-2 px-2 py-1 bg-gray-400/20 rounded-full text-xs text-gray-600">${item.SubCategory.title}</span>`
                                        : ""
                                    }
                                  </div>
                                `;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex flex-col items-center justify-center p-4">
                              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                                <ImageIcon className="w-8 h-8 text-gray-500" />
                              </div>
                              <p className="text-gray-500">تصویر مصاحبه</p>
                              {item.SubCategory && (
                                <span className="mt-2 px-2 py-1 bg-gray-400/20 rounded-full text-xs text-gray-600">
                                  {item.SubCategory.title}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Title Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            <h3 className="text-white font-bold text-lg line-clamp-1">
                              {item.displayTitle}
                            </h3>
                            <p className="text-gray-300 text-sm">
                              {item.displayYear} • {item.displayOrganizer}
                            </p>
                            {item.SubCategory && (
                              <span className="inline-block mt-2 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                                {item.SubCategory.title}
                              </span>
                            )}
                          </div>
                        </>
                      )}
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
                <div className="text-6xl mb-6 opacity-50">📷</div>
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
            <div
              className="absolute inset-0 bg-black/95 backdrop-blur-sm"
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
                      <div className="w-full max-h-[80vh] bg-black flex items-center justify-center">
                        <video
                          key={selectedItem.id}
                          controls
                          autoPlay
                          className="w-full max-h-[80vh]"
                          controlsList="nodownload"
                        >
                          <source src={selectedItem.src} type="video/mp4" />
                          مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
                        </video>
                      </div>
                      <div className="absolute bottom-6 left-6 bg-gradient-to-r from-black/70 to-transparent text-white p-4 rounded-2xl backdrop-blur-sm">
                        <h3 className="text-xl font-bold mb-1">
                          {selectedItem.displayTitle}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                          <Play className="w-4 h-4" />
                          <span>ویدیو مصاحبه • {selectedItem.displayYear}</span>
                        </div>
                        {selectedItem.displayOrganizer && (
                          <p className="text-gray-300 text-sm mt-1">
                            ارائه‌دهنده: {selectedItem.displayOrganizer}
                          </p>
                        )}
                        {selectedItem.SubCategory && (
                          <span className="inline-block mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                            {selectedItem.SubCategory.title}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={selectedItem.src}
                        alt={selectedItem.displayTitle}
                        className="w-full max-h-[80vh] object-contain"
                      />
                      <div className="absolute bottom-6 left-6 bg-gradient-to-r from-black/70 to-transparent text-white p-4 rounded-2xl backdrop-blur-sm">
                        <h3 className="text-xl font-bold mb-1">
                          {selectedItem.displayTitle}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                          <ImageIcon className="w-4 h-4" />
                          <span>تصویر مصاحبه • {selectedItem.displayYear}</span>
                        </div>
                        {selectedItem.displayOrganizer && (
                          <p className="text-gray-300 text-sm mt-1">
                            ارائه‌دهنده: {selectedItem.displayOrganizer}
                          </p>
                        )}
                        {selectedItem.SubCategory && (
                          <span className="inline-block mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                            {selectedItem.SubCategory.title}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                {selectedItem.displayDescription && (
                  <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <p className="text-white leading-relaxed">
                      {selectedItem.displayDescription}
                    </p>
                  </div>
                )}

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
    </div>
  );
};

export default InterviewPage;
