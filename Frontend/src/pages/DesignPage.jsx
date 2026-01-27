import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Palette, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const DesignPage = () => {
  /* ================= STATES ================= */
  const [loading, setLoading] = useState(true);
  const [designProjects, setDesignProjects] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [imageLoading, setImageLoading] = useState({});
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  // Function to get proper image URL
  const getImageUrl = (project) => {
    if (!project) return "/placeholder.jpg";

    // Check mainImage first
    if (project.mainImage) {
      if (project.mainImage.startsWith("http")) {
        return project.mainImage;
      }

      if (project.mainImage.startsWith("/uploads/")) {
        return `http://localhost:5000${project.mainImage}`;
      }

      return `http://localhost:5000/uploads/projects/${project.mainImage}`;
    }

    // Check images array
    if (project.images && project.images.length > 0 && project.images[0].url) {
      const imageUrl = project.images[0].url;

      if (imageUrl.startsWith("http")) {
        return imageUrl;
      }

      if (imageUrl.startsWith("/uploads/")) {
        return `http://localhost:5000${imageUrl}`;
      }

      return `http://localhost:5000/${imageUrl}`;
    }

    return "/placeholder.jpg";
  };

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/projects");
      const projects = res.data || [];

      // Filter design projects
      const designItems = projects.filter((p) => {
        if (!p.Category || !p.Category.title) return false;

        const categoryTitle = p.Category.title.toLowerCase().trim();
        const possibleNames = [
          "طراحی",
          "graphics",
          "طراحی گرافیک",
          "graphic design",
          "تصویرسازی",
          "illustration",
          "لوگو",
          "logo",
          "برندینگ",
          "branding",
          "تایپوگرافی",
          "typography",
          "پوستر",
          "poster",
          "کاتالوگ",
          "catalog",
          "بروشور",
          "brochure",
          "design",
        ];

        return possibleNames.some((name) => categoryTitle.includes(name));
      });

      console.log("Design projects found:", designItems.length);

      // Map projects to proper format
      const mappedDesigns = designItems.map((project) => {
        return {
          ...project,
          id: project.id,
          src: getImageUrl(project),
          displayTitle: project.title || "Untitled Design",
          displayDescription:
            project.description ||
            project.fullDescription ||
            "No description available",
          displayYear:
            project.date ||
            new Date(project.createdAt).getFullYear().toString() ||
            "Unknown",
          displayLocation: project.location || "Unknown",
          displayOrganizer:
            project.organizer || project.exhibitionName || "Unknown",
          displayDuration: project.duration || "Unknown",
          displaySize: project.size || "Unknown",
          displayTechnique: project.technique || "Unknown",
          displaySoftware: project.software || "Unknown",
          displayClient: project.client || "Unknown",
          // Consistent aspect ratio for all cards
          aspectRatio: "landscape",
        };
      });

      setDesignProjects(mappedDesigns);
    } catch (error) {
      console.error("Error fetching design projects:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD MORE ================= */
  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, designProjects.length));
  };

  /* ================= MODAL ================= */
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

  /* ================= LAZY LOADING ================= */
  const handleImageLoad = (id) => {
    setImageLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleImageStartLoad = (id) => {
    setImageLoading((prev) => ({ ...prev, [id]: true }));
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-gray-600 font-medium">
            Loading design projects...
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
          <div className="absolute inset-0 bg-[url('/25.JPG')] bg-cover bg-center" />
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
                Design Collection
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Graphic Design Portfolio
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-cyan-300 mt-3">
                Hamidreza Khajehmohammadi
              </span>
            </h1>

            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-200 leading-relaxed mb-10">
              A collection of graphic design works including posters, logos,
              illustrations, and branding materials
            </p>
          </motion.div>
        </div>
      </div>

      {/* ================= INTRODUCTION SECTION ================= */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            <span className="bg-gradient-to-r from-amber-600 to-cyan-600 bg-clip-text text-transparent">
              Design: Visual Communication
            </span>
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-cyan-400 rounded-full mx-auto mb-8"></div>

          <p className="text-lg text-gray-700 leading-relaxed mb-10 max-w-3xl mx-auto">
            The graphic design works of Hamidreza Khajehmohammadi showcase his
            expertise in visual communication, combining traditional Persian
            aesthetics with modern design principles. Each piece reflects
            careful consideration of composition, color, and typography.
          </p>
        </div>
      </div>

      {/* ================= DESIGN GRID ================= */}
      <div className="container max-w-7xl mx-auto px-4 pb-12 md:pb-20">
        {designProjects.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key="design-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                {designProjects.slice(0, visibleCount).map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="group relative cursor-pointer"
                    onClick={() => openModal(item)}
                  >
                    {/* Card Container - Consistent sizing */}
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-gray-900 to-gray-800">
                      {/* Loading skeleton */}
                      {imageLoading[item.id] && (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-2xl z-10 flex items-center justify-center">
                          <div className="w-10 h-10 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}

                      {/* Image Container */}
                      <div className="relative w-full h-full">
                        <LazyLoadImage
                          src={item.src || "/placeholder.jpg"}
                          alt={item.displayTitle}
                          effect="blur"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          afterLoad={() => handleImageLoad(item.id)}
                          beforeLoad={() => handleImageStartLoad(item.id)}
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                        {/* Design Badge */}
                        <div className="absolute top-4 left-4">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full shadow-lg">
                            <Palette className="w-4 h-4 text-white" />
                            <span className="text-white text-xs font-medium">
                              DESIGN
                            </span>
                          </div>
                        </div>

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <div className="space-y-2">
                            <h3 className="text-white font-bold text-lg line-clamp-2 leading-tight">
                              {item.displayTitle}
                            </h3>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-300 text-sm">
                                  {item.displayYear}
                                </span>
                                {item.displayTechnique !== "Unknown" && (
                                  <>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-300 text-sm line-clamp-1">
                                      {item.displayTechnique}
                                    </span>
                                  </>
                                )}
                              </div>
                              {item.displayClient !== "Unknown" && (
                                <span className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white">
                                  {item.displayClient}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Load More Button - Show after 6 items */}
            {designProjects.length > 6 &&
              visibleCount < designProjects.length && (
                <div className="text-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    className="group px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-600 hover:to-cyan-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <span>Load More Designs</span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-y-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </button>
                  <p className="text-gray-500 text-sm mt-3">
                    Showing {visibleCount} of {designProjects.length} design
                    works
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
              No design projects found
            </p>
          </div>
        )}
      </div>

      {/* ================= STATS SECTION ================= */}

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
              className="fixed inset-0 bg-black/95 backdrop-blur-sm"
              onClick={closeModal}
            />

            <div className="relative min-h-screen flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
                className="relative w-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-2xl"
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
                <div className="p-6">
                  {/* Image with Zoom */}
                  <div className="relative rounded-xl overflow-hidden bg-gray-100 mb-6">
                    <div
                      className="overflow-auto cursor-zoom-in"
                      style={{
                        maxHeight: "70vh",
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
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm backdrop-blur-sm">
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

export default DesignPage;
