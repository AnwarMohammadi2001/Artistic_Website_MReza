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
  Youtube,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronDown,
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const ExhibitionPage = () => {
  /* ================= STATES ================= */
  const [loading, setLoading] = useState(true);
  const [exhibitionProjects, setExhibitionProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [activeSub, setActiveSub] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);
  const [imageLoading, setImageLoading] = useState({});
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  // Function to extract YouTube video ID
  const getYouTubeVideoId = (url) => {
    if (!url) return null;

    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\n?#]+)/,
    );

    return match ? match[1].substring(0, 11) : null;
  };

  // Function to extract Vimeo video ID
  const getVimeoVideoId = (url) => {
    if (!url) return null;

    const regExp = /(?:vimeo\.com\/|video\/)(\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
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

  // Function to check if URL is Vimeo
  const isVimeoLink = (url) => {
    return url && url.includes("vimeo.com");
  };

  // Function to get video thumbnail URL
  const getVideoThumbnail = (project) => {
    if (!project) return "/video-placeholder.jpg";

    // If project has a direct thumbnail
    if (project.thumbnail) {
      return project.thumbnail;
    }

    // If it's a YouTube link
    if (project.link) {
      const youtubeId = getYouTubeVideoId(project.link);
      if (youtubeId) {
        return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
      }

      // If it's a Vimeo link
      const vimeoId = getVimeoVideoId(project.link);
      if (vimeoId) {
        return `https://vumbnail.com/${vimeoId}.jpg`;
      }
    }

    return "/video-placeholder.jpg";
  };

  // Function to get proper media URL
  const getMediaUrl = (project) => {
    if (!project) return "/placeholder.jpg";

    // Check mainImage first
    if (project.mainImage) {
      if (project.mainImage.startsWith("http")) {
        return project.mainImage;
      }

      if (project.mainImage.startsWith("/uploads/")) {
        return `${BASE_URL}${project.mainImage}`;
      }

      return `${BASE_URL}/uploads/projects/${project.mainImage}`;
    }

    // Check images array
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

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/projects`);
      const projects = res.data || [];

      // Filter exhibition projects
      const exhibitions = projects.filter((p) => {
        if (!p.Category || !p.Category.title) return false;

        const categoryTitle = p.Category.title.toLowerCase().trim();
        const possibleNames = ["نمایشگاه", "exhibition"];

        return possibleNames.some((name) => categoryTitle.includes(name));
      });

      console.log("Exhibition projects found:", exhibitions.length);

      // Map projects to proper format
      const mappedExhibitions = exhibitions.map((project) => {
        // Determine media type
        let type = "image";
        let hasYouTubeLink = false;
        let hasVimeoLink = false;
        let videoId = null;
        let vimeoId = null;

        if (project.link) {
          videoId = getYouTubeVideoId(project.link);
          vimeoId = getVimeoVideoId(project.link);

          if (videoId || vimeoId || project.mediaType === "video") {
            type = "video";
            hasYouTubeLink = !!videoId;
            hasVimeoLink = !!vimeoId;
          }
        }

        const mediaUrl = getMediaUrl(project);
        const thumbnail =
          type === "video" ? getVideoThumbnail(project) : mediaUrl;

        return {
          ...project,
          id: project.id,
          type: type,
          src: mediaUrl,
          thumbnail: thumbnail,
          displayTitle: project.title || "Untitled Exhibition",
          displayYear:
            project.date ||
            new Date(project.createdAt).getFullYear().toString() ||
            "Unknown",
          displayLocation: project.location || "Unknown",
          displayOrganizer:
            project.organizer || project.exhibitionName || "Unknown",
          // Video specific properties
          videoId: videoId,
          vimeoId: vimeoId,
          videoUrl: project.link,
          hasYouTubeLink: hasYouTubeLink,
          hasVimeoLink: hasVimeoLink,
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
      setVisibleCount(9);

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
    setVisibleCount((prev) => Math.min(prev + 9, filteredProjects.length));
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
          <div className="absolute inset-0 bg-[url('/ex.jpeg')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-black/60" />
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
      {/* ================= EXHIBITIONS GRID ================= */}
      <div className="container max-w-7xl mx-auto px-4 pb-12 md:pb-20">
        {filteredProjects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProjects.slice(0, visibleCount).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index >= 9 ? (index - 9) * 0.05 : index * 0.05,
                  }}
                  className="group relative cursor-pointer"
                  onClick={() => openModal(item)}
                >
                  {/* Card Container */}
                  <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500  h-[300px]">
                    {/* Loading skeleton */}
                    {imageLoading[item.id] && (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-xl z-10 flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}

                    {/* Media Container */}
                    <div className="relative w-full">
                      {item.type === "video" ? (
                        <div className="relative w-full h-full">
                          <LazyLoadImage
                            src={item.thumbnail}
                            alt={item.displayTitle}
                            effect="blur"
                            className="w-full h-[300px] object-cover"
                            afterLoad={() => handleImageLoad(item.id)}
                            beforeLoad={() => handleImageStartLoad(item.id)}
                          />

                          {/* Play Button */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-300">
                              <div className="w-12 h-12 bg-black/70 rounded-full flex items-center justify-center">
                                <Youtube className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Image Thumbnail */}
                          <LazyLoadImage
                            src={item.src || "/placeholder.jpg"}
                            alt={item.displayTitle}
                            effect="blur"
                            className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-500"
                            afterLoad={() => handleImageLoad(item.id)}
                            beforeLoad={() => handleImageStartLoad(item.id)}
                          />

                          {/* Image Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More Button */}
            {filteredProjects.length > 6 &&
              visibleCount < filteredProjects.length && (
                <div className="text-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    className="group px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-600 hover:to-cyan-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <span>Load More Exhibitions</span>
                    <ChevronDown className="transform group-hover:translate-y-1 transition-transform" />
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

                {/* Zoom Controls for Images */}
                {selectedItem.type === "image" && (
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
                )}

                {/* Modal Content */}
                <div className="p-6">
                  {selectedItem.type === "video" ? (
                    <div className="aspect-video rounded-xl overflow-hidden bg-black mb-6">
                      {selectedItem.hasYouTubeLink ? (
                        // YouTube Embed
                        <iframe
                          key={selectedItem.id}
                          src={`https://www.youtube.com/embed/${selectedItem.videoId}?autoplay=1&rel=0&modestbranding=1`}
                          title={selectedItem.displayTitle}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : selectedItem.vimeoId ? (
                        // Vimeo Embed
                        <iframe
                          key={selectedItem.id}
                          src={`https://player.vimeo.com/video/${selectedItem.vimeoId}?autoplay=1&title=0&byline=0&portrait=0`}
                          title={selectedItem.displayTitle}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        // Direct video file
                        <video
                          key={selectedItem.id}
                          controls
                          autoPlay
                          className="w-full h-full"
                          controlsList="nodownload"
                        >
                          <source
                            src={selectedItem.videoUrl}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  ) : (
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
