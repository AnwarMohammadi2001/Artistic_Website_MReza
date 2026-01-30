import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music,
  BookOpen,
  Film,
  Gamepad2,
  ChefHat,
  Globe,
  Lightbulb,
  Coffee,
  X,
  Filter,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronDown,
  Headphones,
  Camera,
  Palette,
  Sparkles,
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const MiscellaneousPage = () => {
  /* ================= STATES ================= */
  const [loading, setLoading] = useState(true);
  const [miscProjects, setMiscProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [activeSub, setActiveSub] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [imageLoading, setImageLoading] = useState({});
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  /* ================= CATEGORIES WITH DETAILS ================= */
  const categories = [
    {
      id: "music",
      label: "موزیک و صوت",
      icon: <Music className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-500",
      gradient: "bg-gradient-to-r from-emerald-500 to-teal-500",
      description: "آثار صوتی، موسیقی و پادکست‌ها",
    },
    {
      id: "books",
      label: "کتاب‌خوانی",
      icon: <BookOpen className="w-6 h-6" />,
      color: "from-amber-500 to-orange-500",
      gradient: "bg-gradient-to-r from-amber-500 to-orange-500",
      description: "نقد کتاب، معرفی آثار و مقالات ادبی",
    },
    {
      id: "movies",
      label: "فیلم و سینما",
      icon: <Film className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
      description: "نقد فیلم، تحلیل سینمایی و مستند",
    },
    {
      id: "games",
      label: "بازی و سرگرمی",
      icon: <Gamepad2 className="w-6 h-6" />,
      color: "from-red-500 to-rose-500",
      gradient: "bg-gradient-to-r from-red-500 to-rose-500",
      description: "بازی‌های ویدیویی، فکری و سرگرمی",
    },
    {
      id: "cooking",
      label: "آشپزی",
      icon: <ChefHat className="w-6 h-6" />,
      color: "from-yellow-500 to-red-500",
      gradient: "bg-gradient-to-r from-yellow-500 to-red-500",
      description: "دستور پخت، تکنیک‌ها و فرهنگ غذایی",
    },
    {
      id: "travel",
      label: "سفر و گردشگری",
      icon: <Globe className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      gradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
      description: "تجربیات سفر، راهنمای گردشگری",
    },
    {
      id: "tech",
      label: "تکنولوژی",
      icon: <Lightbulb className="w-6 h-6" />,
      color: "from-indigo-500 to-purple-500",
      gradient: "bg-gradient-to-r from-indigo-500 to-purple-500",
      description: "فناوری‌های جدید، گجت‌ها و نوآوری",
    },
    {
      id: "lifestyle",
      label: "سبک زندگی",
      icon: <Coffee className="w-6 h-6" />,
      color: "from-brown-500 to-amber-500",
      gradient: "bg-gradient-to-r from-brown-500 to-amber-500",
      description: "سلامت، آرامش و بهبود کیفیت زندگی",
    },
  ];

  /* ================= HELPER FUNCTIONS ================= */
  const getImageUrl = (project) => {
    if (!project) return "/placeholder.jpg";

    if (project.mainImage) {
      if (project.mainImage.startsWith("http")) {
        return project.mainImage;
      }
      if (project.mainImage.startsWith("/uploads/")) {
        return `${BASE_URL}${project.mainImage}`;
      }
      return `${BASE_URL}/uploads/projects/${project.mainImage}`;
    }

    if (project.images && project.images.length > 0 && project.images[0].url) {
      const imageUrl = project.images[0].url;
      if (imageUrl.startsWith("http")) {
        return imageUrl;
      }
      if (imageUrl.startsWith("/uploads/")) {
        return `${BASE_URL}${imageUrl}`;
      }
      return `${BASE_URL}/${imageUrl}`;
    }

    return "/placeholder.jpg";
  };

  const getCategoryInfo = (project) => {
    if (!project) return categories[0];

    const categoryId =
      project.category ||
      (project.Category ? project.Category.title?.toLowerCase() : "");

    const foundCategory = categories.find(
      (cat) =>
        categoryId.includes(cat.id) ||
        (project.Category &&
          project.Category.title
            ?.toLowerCase()
            .includes(cat.label.toLowerCase())),
    );

    return foundCategory || categories[0];
  };

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/projects`);
      const projects = res.data || [];

      const miscCategories = ["متفرقه", "miscellaneous"];

      const misc = projects.filter((p) => {
        if (!p.Category || !p.Category.title) return false;
        const categoryTitle = p.Category.title.toLowerCase().trim();
        return miscCategories.some((cat) => categoryTitle.includes(cat));
      });

      const mappedProjects = misc.map((project) => {
        const categoryInfo = getCategoryInfo(project);
        return {
          ...project,
          id: project.id,
          src: getImageUrl(project),
          icon: categoryInfo.icon,
          categoryColor: categoryInfo.color,
          gradient: categoryInfo.gradient,
          displayTitle: project.title || "Untitled Project",
          displayDescription: project.description || "No description available",
          displayYear:
            project.year ||
            new Date(project.createdAt).getFullYear().toString(),
          displayArtist: project.artist || "Unknown",
          tags: project.tags || [],
          categoryLabel: categoryInfo.label,
          aspectRatio: "square",
        };
      });

      setMiscProjects(mappedProjects);
      setFilteredProjects(mappedProjects);

      const subs = mappedProjects
        .map((p) => p.SubCategory)
        .filter((s) => s && (s.id || s.title))
        .map((s) => ({
          id: s.id || s.title,
          title: s.title,
          count: mappedProjects.filter(
            (p) =>
              p.SubCategory &&
              (p.SubCategory.id === s.id || p.SubCategory.title === s.title),
          ).length,
        }));

      const uniqueSubs = Array.from(
        new Map(subs.filter((s) => s.title).map((s) => [s.id, s])).values(),
      );

      setSubCategories(uniqueSubs);
      setActiveSub(null);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setFilteredProjects(sampleItems);
      setSubCategories(sampleSubCategories);
      setActiveSub(null);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SAMPLE DATA ================= */
  const sampleSubCategories = [
    { id: "all", title: "همه", count: 8 },
    { id: "recommended", title: "پیشنهادی", count: 4 },
    { id: "popular", title: "محبوب‌ترین", count: 4 },
    { id: "recent", title: "جدیدترین", count: 4 },
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
    // ... other sample items
  ].map((item) => {
    const categoryInfo =
      categories.find((cat) => cat.id === item.category) || categories[0];
    return {
      ...item,
      src: item.images[0].url,
      icon: categoryInfo.icon,
      categoryColor: categoryInfo.color,
      gradient: categoryInfo.gradient,
      displayTitle: item.title,
      displayDescription: item.description,
      displayYear: item.year,
      displayArtist: item.artist,
      categoryLabel: categoryInfo.label,
      aspectRatio: "square",
    };
  });

  /* ================= FILTER FUNCTIONS ================= */
  const filterBySubCategory = useCallback(
    (subId) => {
      setActiveSub(subId);
      setVisibleCount(8);

      if (subId === null || subId === "all") {
        setFilteredProjects(miscProjects);
        return;
      }

      if (subId === "recommended") {
        const recommended = miscProjects.filter((p) => p.id % 2 === 0);
        setFilteredProjects(recommended);
      } else if (subId === "popular") {
        const popular = miscProjects.filter((p) => p.id % 3 === 0);
        setFilteredProjects(popular);
      } else if (subId === "recent") {
        const recent = [...miscProjects].reverse();
        setFilteredProjects(recent);
      } else {
        const filtered = miscProjects.filter((p) => {
          if (!p.SubCategory) return false;
          return p.SubCategory.id === subId || p.SubCategory.title === subId;
        });
        setFilteredProjects(filtered);
      }
    },
    [miscProjects],
  );

  /* ================= LOAD MORE ================= */
  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 8, filteredProjects.length));
  };

  /* ================= MODAL FUNCTIONS ================= */
  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    setZoomLevel(1);
    setIsZoomed(false);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
    setZoomLevel(1);
    setIsZoomed(false);
    document.body.style.overflow = "auto";
  };

  /* ================= ZOOM CONTROLS ================= */
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
    setIsZoomed(true);
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 1));
    if (zoomLevel <= 1.25) setIsZoomed(false);
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
    setIsZoomed(false);
  };

  /* ================= IMAGE LOADING ================= */
  const handleImageLoad = (id) => {
    setImageLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleImageStartLoad = (id) => {
    setImageLoading((prev) => ({ ...prev, [id]: true }));
  };

  /* ================= ANIMATIONS ================= */
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

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-gray-600 font-medium">
            Loading miscellaneous projects...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* ================= HERO SECTION ================= */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/25.jpg')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-black/80" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                Miscellaneous Collection
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Creative Universe
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300 mt-3">
                Hamidreza Khajehmohammadi
              </span>
            </h1>

            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-200 leading-relaxed mb-10">
              A diverse collection of creative works spanning music, literature,
              film, travel, technology, and lifestyle
            </p>
          </motion.div>
        </div>
      </div>

      {/* ================= INTRODUCTION SECTION ================= */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              Diverse Creative Interests
            </span>
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mx-auto mb-8"></div>

          <p className="text-lg text-gray-700 leading-relaxed mb-10 max-w-3xl mx-auto">
            Explore various creative pursuits and personal interests beyond
            traditional artwork. This collection showcases a wide range of
            passions including music, literature, cinema, travel experiences,
            technological explorations, and lifestyle inspirations.
          </p>

          {/* ================= CATEGORY FILTER BUTTONS ================= */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Filter className="text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-700">
                Filter by Category
              </h3>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {/* All Button */}
              <button
                onClick={() => filterBySubCategory(null)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeSub === null
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                All Categories
              </button>

              {/* Subcategory Buttons */}
              {subCategories.map((sub) => {
                const isActive = activeSub === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => filterBySubCategory(sub.id)}
                    className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500 to-cyan-400 text-white shadow-lg"
                        : "bg-white text-gray-700 hover:bg-cyan-50 border border-gray-200 hover:border-cyan-200"
                    }`}
                  >
                    {sub.title}
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        isActive ? "bg-white/20" : "bg-gray-100"
                      }`}
                    >
                      {sub.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ================= PROJECTS GRID ================= */}
      <div className="container max-w-7xl mx-auto px-4 pb-12 md:pb-20">
        {filteredProjects.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSub}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
              >
                {filteredProjects.slice(0, visibleCount).map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="group relative cursor-pointer"
                    onClick={() => openModal(item)}
                  >
                    {/* Card Container - Square aspect ratio */}
                    <div className="relative  overflow-hidden  rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500">
                      {/* Loading skeleton */}
                      {imageLoading[item.id] && (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-xl z-10 flex items-center justify-center">
                          <div className="w-10 h-10 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}

                      {/* Image Container - FIXED: Add relative to parent */}
                      <div className="relative w-full h-full">
                        <LazyLoadImage
                          src={item.src || "/placeholder.jpg"}
                          alt={item.displayTitle}
                          effect="blur"
                          className=" w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          afterLoad={() => handleImageLoad(item.id)}
                          beforeLoad={() => handleImageStartLoad(item.id)}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Load More Button */}
            {filteredProjects.length > 8 &&
              visibleCount < filteredProjects.length && (
                <div className="text-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    className="group px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-600 hover:to-emerald-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <span>Load More Projects</span>
                    <ChevronDown className="transform group-hover:translate-y-1 transition-transform" />
                  </button>
                  <p className="text-gray-500 text-sm mt-3">
                    Showing {visibleCount} of {filteredProjects.length} projects
                  </p>
                </div>
              )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Palette className="text-gray-400 text-4xl" />
            </div>
            <p className="text-gray-500 text-xl font-medium">
              No projects found in this category
            </p>
            <p className="text-gray-400 mt-2">Please select another category</p>
          </div>
        )}
      </div>

      {/* ================= PROJECT DETAIL MODAL ================= */}
      <AnimatePresence>
        {isModalOpen && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeModal}
            />

            <div className="relative min-h-screen flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
                className="relative w-full max-w-6xl bg-white rounded-xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-6 right-6 z-50 w-14 h-14 bg-gray-800/90 hover:bg-gray-900 rounded-full flex items-center justify-center transition-colors group shadow-xl"
                >
                  <X className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                </button>

                {/* Zoom Controls */}
                <div className="absolute top-6 left-6 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                  <button
                    onClick={handleZoomOut}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    disabled={zoomLevel <= 1}
                  >
                    <ZoomOut className="w-5 h-5 text-gray-700" />
                  </button>
                  <span className="text-gray-700 font-medium text-sm min-w-[60px] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    disabled={zoomLevel >= 3}
                  >
                    <ZoomIn className="w-5 h-5 text-gray-700" />
                  </button>
                  {isZoomed && (
                    <button
                      onClick={handleZoomReset}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-2"
                    >
                      <Maximize2 className="w-5 h-5 text-gray-700" />
                    </button>
                  )}
                </div>

                {/* Modal Content */}
                <div className="p-8">
                  {/* Project Image with Zoom */}
                  <div className="relative rounded-xl overflow-hidden bg-gray-100 mb-8">
                    <div
                      className="overflow-auto cursor-zoom-in"
                      style={{
                        maxHeight: "80vh",
                        transform: `scale(${zoomLevel})`,
                        transformOrigin: "center",
                        transition: "transform 0.3s ease",
                      }}
                      onClick={(e) => {
                        if (zoomLevel === 1) handleZoomIn();
                        else handleZoomReset();
                      }}
                    >
                      <img
                        src={selectedItem.src || "/placeholder.jpg"}
                        alt={selectedItem.displayTitle}
                        className="w-full h-auto"
                        style={{
                          minWidth: "100%",
                          minHeight: "100%",
                        }}
                      />
                    </div>

                    {/* Zoom hint */}
                    {zoomLevel === 1 && (
                      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                          <ZoomIn className="w-4 h-4" />
                          <span>Click to zoom</span>
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

export default MiscellaneousPage;
