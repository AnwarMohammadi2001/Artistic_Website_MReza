import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Calendar,
  Users,
  Play,
  Film,
  Image as ImageIcon,
  Filter,
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const ExhibitionPage = () => {
  /* ================= STATES ================= */
  const [loading, setLoading] = useState(true);
  const [exhibitionProjects, setExhibitionProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [activeSub, setActiveSub] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [imageLoading, setImageLoading] = useState({});

  // Function to get proper media URL
  const getMediaUrl = (project) => {
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

    // Check link (could be YouTube or other video)
    if (project.link) {
      return project.link;
    }

    return "/placeholder.jpg";
  };

  // Function to extract YouTube thumbnail
  const getYouTubeThumbnail = (url) => {
    if (!url || !url.includes("youtube") || !url.includes("v=")) {
      return null;
    }

    try {
      const videoId = url.split("v=")[1];
      const ampersandPosition = videoId.indexOf("&");
      if (ampersandPosition !== -1) {
        return `https://img.youtube.com/vi/${videoId.substring(0, ampersandPosition)}/hqdefault.jpg`;
      }
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    } catch (error) {
      return null;
    }
  };

  // Function to check if URL is YouTube
  const isYouTubeLink = (url) => {
    return (
      url &&
      (url.includes("youtube.com") ||
        url.includes("youtu.be") ||
        url.includes("youtube.com/watch"))
    );
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

      // Filter exhibition projects
      const exhibitions = projects.filter((p) => {
        if (!p.Category || !p.Category.title) return false;

        const categoryTitle = p.Category.title.toLowerCase().trim();
        const possibleNames = [
          "نمایشگاه",
          "exhibition",
          "exhibitions",
          "گالری",
          "gallery",
          "نمایش",
          "show",
          "expo",
        ];

        return possibleNames.some((name) => categoryTitle.includes(name));
      });

      console.log("Exhibition projects found:", exhibitions.length);

      // Map projects to proper format
      const mappedExhibitions = exhibitions.map((project) => {
        const mediaUrl = getMediaUrl(project);
        const isVideo =
          isYouTubeLink(mediaUrl) || project.mediaType === "video";
        const thumbnail = isYouTubeLink(mediaUrl)
          ? getYouTubeThumbnail(mediaUrl)
          : mediaUrl;

        return {
          ...project,
          id: project.id,
          src: mediaUrl,
          thumbnail: thumbnail,
          isVideo: isVideo,
          displayTitle: project.title || "Untitled Exhibition",
          displayYear:
            project.date ||
            new Date(project.createdAt).getFullYear().toString() ||
            "Unknown",
          displayLocation: project.location || "Unknown",
          displayOrganizer:
            project.organizer || project.exhibitionName || "Unknown",
          // Consistent aspect ratio for all cards
          aspectRatio: "landscape",
        };
      });

      setExhibitionProjects(mappedExhibitions);
      setFilteredProjects(mappedExhibitions);

      // Extract unique subcategories
      const subs = mappedExhibitions
        .map((p) => p.SubCategory)
        .filter((s) => s && (s.id || s.title))
        .map((s) => ({
          id: s.id || s.title,
          title: s.title,
          count: mappedExhibitions.filter(
            (p) =>
              p.SubCategory &&
              (p.SubCategory.id === s.id || p.SubCategory.title === s.title),
          ).length,
        }));

      // Remove duplicates and filter out null/undefined titles
      const uniqueSubs = Array.from(
        new Map(subs.filter((s) => s.title).map((s) => [s.id, s])).values(),
      );

      setSubCategories(uniqueSubs);

      // Activate "All" by default
      setActiveSub(null);
    } catch (error) {
      console.error("Error fetching exhibitions:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER BY SUB CATEGORY ================= */
  const filterBySubCategory = useCallback(
    (subId) => {
      setActiveSub(subId);
      setVisibleCount(6);

      if (subId === null) {
        setFilteredProjects(exhibitionProjects);
        return;
      }

      const filtered = exhibitionProjects.filter((p) => {
        if (!p.SubCategory) return false;
        return p.SubCategory.id === subId || p.SubCategory.title === subId;
      });

      setFilteredProjects(filtered);
    },
    [exhibitionProjects],
  );

  /* ================= LOAD MORE ================= */
  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, filteredProjects.length));
  };

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

  /* ================= LAZY LOADING ================= */
  const handleImageLoad = (id) => {
    setImageLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleImageStartLoad = (id) => {
    setImageLoading((prev) => ({ ...prev, [id]: true }));
  };

  /* ================= YOUTUBE EMBED ================= */
  const getYouTubeEmbedUrl = (url) => {
    if (!url || !url.includes("youtube")) return url;

    try {
      let videoId = "";

      // Handle different YouTube URL formats
      if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1];
      } else if (url.includes("youtube.com/watch")) {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get("v");
      } else if (url.includes("youtube.com/embed/")) {
        videoId = url.split("embed/")[1];
      }

      // Clean up video ID (remove any extra parameters)
      if (videoId && videoId.includes("?")) {
        videoId = videoId.split("?")[0];
      }

      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } catch (error) {
      return url;
    }
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
            Loading exhibitions...
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
          <div className="absolute inset-0 bg-[url('/ex.JPG')] bg-cover bg-center" />
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
                Exhibitions Collection
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Art Exhibitions
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-cyan-300 mt-3">
                Hamidreza Khajehmohammadi
              </span>
            </h1>

            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-200 leading-relaxed mb-10">
              A collection of national and international art exhibitions
              spanning four decades
            </p>
          </motion.div>
        </div>
      </div>

      {/* ================= INTRODUCTION SECTION ================= */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            <span className="bg-gradient-to-r from-amber-600 to-cyan-600 bg-clip-text text-transparent">
              Exhibitions: Showcasing Art to the World
            </span>
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-cyan-400 rounded-full mx-auto mb-8"></div>

          <p className="text-lg text-gray-700 leading-relaxed mb-10 max-w-3xl mx-auto">
            Through numerous national and international exhibitions, Hamidreza
            Khajehmohammadi has presented his artworks to diverse audiences,
            sharing his artistic vision and cultural heritage with the world.
          </p>

          {/* ================= CATEGORY FILTER BUTTONS ================= */}
          {subCategories.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Filter className="text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-700">
                  Filter by Exhibition Type
                </h3>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {/* All Button */}
                <button
                  onClick={() => filterBySubCategory(null)}
                  className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeSub === null
                      ? "bg-gradient-to-r from-cyan-500 to-cyan-400 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-cyan-50 border border-gray-200 hover:border-cyan-200"
                  }`}
                >
                  All Exhibitions
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
                          ? "bg-gradient-to-r from-purple-500 to-purple-400 text-white shadow-lg"
                          : "bg-white text-gray-700 hover:bg-purple-50 border border-gray-200 hover:border-purple-200"
                      }`}
                    >
                      {sub.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= EXHIBITIONS GRID ================= */}
      <div className="container max-w-7xl mx-auto px-4 pb-12 md:pb-20">
        {filteredProjects.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSub}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                {filteredProjects.slice(0, visibleCount).map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="group relative cursor-pointer"
                    onClick={() => openModal(item)}
                  >
                    {/* Card Container - Consistent sizing */}
                    <div className="relative h-[300px] overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-gray-900 to-gray-800">
                      {/* Loading skeleton */}
                      {imageLoading[item.id] && (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-lg z-10 flex items-center justify-center">
                          <div className="w-10 h-10 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}

                      {/* Media Container - FIXED: Full width/height */}
                      <div className="relative w-full h-[300px]">
                        {item.isVideo ? (
                          <>
                            {/* Video Thumbnail - FIXED: Full container */}
                            <LazyLoadImage
                              src={item.thumbnail || "/placeholder.jpg"}
                              alt={item.displayTitle}
                              effect="blur"
                              className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                              afterLoad={() => handleImageLoad(item.id)}
                              beforeLoad={() => handleImageStartLoad(item.id)}
                            />

                            {/* Gradient overlay - FIXED: Cover entire media */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

                            {/* Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-300">
                                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                                  <Play className="w-6 h-6 text-white ml-1" />
                                </div>
                              </div>
                            </div>

                            {/* Video Badge */}
                            <div className="absolute top-4 left-4">
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg">
                                <Film className="w-4 h-4 text-white" />
                                <span className="text-white text-xs font-medium">
                                  VIDEO
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Image Thumbnail - FIXED: Full container */}
                            <LazyLoadImage
                              src={item.src || "/placeholder.jpg"}
                              alt={item.displayTitle}
                              effect="blur"
                              className="w-full h-[300px] object-cover group-hover:scale-105 transition-all duration-500"
                              afterLoad={() => handleImageLoad(item.id)}
                              beforeLoad={() => handleImageStartLoad(item.id)}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Load More Button - Show after 6 items */}
            {filteredProjects.length > 6 &&
              visibleCount < filteredProjects.length && (
                <div className="text-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    className="group px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-600 hover:to-cyan-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <span>Load More Exhibitions</span>
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
                    Showing {visibleCount} of {filteredProjects.length}{" "}
                    exhibitions
                  </p>
                </div>
              )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="text-gray-400 text-4xl" />
            </div>
            <p className="text-gray-500 text-xl font-medium">
              No exhibitions found in this category
            </p>
            <p className="text-gray-400 mt-2">Please select another category</p>
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
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

                {/* Modal Content */}
                <div className="p-6">
                  {selectedItem.isVideo ? (
                    // YouTube Video Player
                    <div className="aspect-video rounded-xl overflow-hidden bg-black mb-6">
                      <iframe
                        src={getYouTubeEmbedUrl(selectedItem.src)}
                        title={selectedItem.displayTitle}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    // Image Display
                    <div className="rounded-xl overflow-hidden bg-gray-100 mb-6">
                      <img
                        src={selectedItem.src || "/placeholder.jpg"}
                        alt={selectedItem.displayTitle}
                        className="w-full max-h-[70vh] object-contain mx-auto"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExhibitionPage;
