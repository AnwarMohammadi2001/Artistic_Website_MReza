import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  X,
  Film,
  Image as ImageIcon,
  Filter,
  ChevronDown,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Youtube,
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const InterviewPage = () => {
  /* ================= STATES ================= */
  const [loading, setLoading] = useState(true);
  const [interviewProjects, setInterviewProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [activeSub, setActiveSub] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [imageLoading, setImageLoading] = useState({});
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [videoThumbnails, setVideoThumbnails] = useState({});
  const videoRefs = useRef({});

  // Function to extract YouTube video ID - نسخه بهبود یافته
  const getYouTubeVideoId = (url) => {
    if (!url) return null;

    // الگوهای مختلف YouTube
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/,
      /youtube\.com\/.*v=([^&]+)/,
      /youtu\.be\/([^?]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1].substring(0, 11); // YouTube IDs are always 11 characters
      }
    }

    return null;
  };

  // Function to extract Vimeo video ID
  const getVimeoVideoId = (url) => {
    if (!url) return null;

    const regExp = /(?:vimeo\.com\/|video\/)(\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

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

  // Function to get video thumbnail URL - نسخه بهبود یافته
  const getVideoThumbnail = (project) => {
    console.log("Getting thumbnail for project:", project.title, project.link);

    // If project has a direct thumbnail
    if (project.thumbnail) {
      console.log("Using direct thumbnail:", project.thumbnail);
      return project.thumbnail;
    }

    // If it's a YouTube link
    if (project.link) {
      const youtubeId = getYouTubeVideoId(project.link);
      console.log("YouTube ID extracted:", youtubeId);

      if (youtubeId) {
        return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
      }

      // If it's a Vimeo link
      const vimeoId = getVimeoVideoId(project.link);
      if (vimeoId) {
        return `https://vumbnail.com/${vimeoId}.jpg`;
      }
    }

    // Default thumbnail
    console.log("Using default thumbnail");
    return "/video-placeholder.jpg";
  };

  // Function to capture video frame as thumbnail
  const captureVideoFrame = (videoElement, id) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL("image/jpeg");
      resolve(dataUrl);
    });
  };

  // Handle video loaded metadata
  const handleVideoLoaded = async (id, videoElement) => {
    try {
      // Seek to the beginning
      videoElement.currentTime = 0;

      // Wait for frame to be ready
      await new Promise((resolve) => {
        videoElement.addEventListener("seeked", resolve, { once: true });
      });

      // Capture frame
      const thumbnailUrl = await captureVideoFrame(videoElement, id);

      // Update thumbnails state
      setVideoThumbnails((prev) => ({
        ...prev,
        [id]: thumbnailUrl,
      }));

      // Mark image as loaded
      handleImageLoad(id);
    } catch (error) {
      console.error("Error capturing video frame:", error);
      handleImageLoad(id);
    }
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

      // Filter interview projects
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
          "talk",
          "conversation",
        ];

        return possibleNames.some((name) => categoryTitle.includes(name));
      });

      console.log("Interview projects found:", interviews.length);

      // Map projects to proper format with consistent sizing
      const mappedInterviews = interviews.map((project) => {
        // Determine media type
        let type = "image";
        let hasYouTubeLink = false;

        if (project.link) {
          const youtubeId = getYouTubeVideoId(project.link);
          const vimeoId = getVimeoVideoId(project.link);

          if (
            youtubeId ||
            vimeoId ||
            project.mediaType === "video" ||
            project.link?.includes(".mp4") ||
            project.link?.includes(".mov") ||
            project.link?.includes(".avi") ||
            project.link?.includes("youtube") ||
            project.link?.includes("vimeo") ||
            project.link?.includes("youtu.be")
          ) {
            type = "video";
            hasYouTubeLink = !!youtubeId;
          }
        }

        return {
          ...project,
          id: project.id,
          type: type,
          src:
            type === "image"
              ? getImageUrl(project)
              : getVideoThumbnail(project),
          displayTitle: project.title || "Untitled Interview",
          displayDescription:
            project.description ||
            project.fullDescription ||
            "No description available",
          displayYear:
            project.date ||
            new Date(project.createdAt).getFullYear().toString() ||
            "Unknown",
          displayOrganizer:
            project.organizer || project.exhibitionName || "Unknown",
          // Video specific properties
          videoId: hasYouTubeLink ? getYouTubeVideoId(project.link) : null,
          vimeoId: getVimeoVideoId(project.link),
          videoUrl: project.link,
          hasYouTubeLink: hasYouTubeLink,
          aspectRatio: "landscape",
        };
      });

      setInterviewProjects(mappedInterviews);
      setFilteredProjects(mappedInterviews);

      // Extract unique subcategories
      const subs = mappedInterviews
        .map((p) => p.SubCategory)
        .filter((s) => s && (s.id || s.title))
        .map((s) => ({
          id: s.id || s.title,
          title: s.title,
          count: mappedInterviews.filter(
            (p) =>
              p.SubCategory &&
              (p.SubCategory.id === s.id || p.SubCategory.title === s.title),
          ).length,
        }));

      // Remove duplicates
      const uniqueSubs = Array.from(
        new Map(subs.map((s) => [s.id, s])).values(),
      );

      setSubCategories(uniqueSubs);

      // Activate first subcategory
      if (uniqueSubs.length > 0) {
        setActiveSub(uniqueSubs[0].id);
        // مستقیماً فیلتر کنید
        const filtered = mappedInterviews.filter((p) => {
          if (!p.SubCategory) return false;
          return (
            p.SubCategory.id === uniqueSubs[0].id ||
            p.SubCategory.title === uniqueSubs[0].title
          );
        });
        setFilteredProjects(filtered);
      }
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER BY SUB CATEGORY ================= */
  const filterBySubCategory = useCallback(
    (sub) => {
      if (!sub) return;

      setActiveSub(sub.id);
      setVisibleCount(6);

      const filtered = interviewProjects.filter((p) => {
        if (!p.SubCategory) return false;
        return p.SubCategory.id === sub.id || p.SubCategory.title === sub.title;
      });

      setFilteredProjects(filtered);
    },
    [interviewProjects],
  );

  /* ================= LOAD MORE ================= */
  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, filteredProjects.length));
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
            Loading interviews...
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
          <div className="absolute inset-0 bg-[url('/int.JPG')] bg-cover bg-center" />
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
                Interviews Collection
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Conversations & Media
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-cyan-300 mt-3">
                Hamidreza Khajehmohammadi
              </span>
            </h1>

            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-200 leading-relaxed mb-10">
              A collection of interviews, talks, and media appearances spanning
              four decades of artistic career
            </p>
          </motion.div>
        </div>
      </div>

      {/* ================= INTRODUCTION SECTION ================= */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            <span className="bg-gradient-to-r from-amber-600 to-cyan-600 bg-clip-text text-transparent">
              Interviews: Voice of the Artist
            </span>
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-cyan-400 rounded-full mx-auto mb-8"></div>

          <p className="text-lg text-gray-700 leading-relaxed mb-10 max-w-3xl mx-auto">
            Through interviews and conversations, Hamidreza Khajehmohammadi
            shares his artistic vision, creative process, and insights into the
            role of art in society. These media appearances provide a deeper
            understanding of his work and philosophy.
          </p>

          {/* ================= FILTER SECTION ================= */}
          {subCategories.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Filter className="text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-700">
                  Filter by Type
                </h3>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {subCategories.map((sub) => {
                  const isActive = activeSub === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => filterBySubCategory(sub)}
                      className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                        isActive
                          ? "bg-gradient-to-r from-cyan-500 to-cyan-400 text-white shadow-lg"
                          : "bg-white text-gray-700 hover:bg-cyan-50 border border-gray-200 hover:border-cyan-200"
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

      {/* ================= INTERVIEWS GRID ================= */}
      <div className="container mx-auto px-4 pb-12 md:pb-20">
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
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-gray-900 to-gray-800">
                      {/* Loading skeleton */}
                      {imageLoading[item.id] && (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-2xl z-10 flex items-center justify-center">
                          <div className="w-10 h-10 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}

                      {/* Media Container */}
                      <div className="relative w-full h-full">
                        {item.type === "video" ? (
                          <>
                            {/* نمایش ویدیو برای استخراج فریم اول */}
                            <div className="relative w-full h-full">
                              <video
                                ref={(el) => {
                                  if (el && !videoRefs.current[item.id]) {
                                    videoRefs.current[item.id] = el;
                                  }
                                }}
                                muted
                                preload="metadata"
                                playsInline
                                className="w-full h-full object-cover"
                                onLoadedMetadata={async (e) => {
                                  const videoElement = e.target;
                                  try {
                                    // Set current time to beginning
                                    videoElement.currentTime = 0;
                                  } catch (error) {
                                    console.error(
                                      "Error setting currentTime:",
                                      error,
                                    );
                                  }
                                }}
                                onCanPlay={async (e) => {
                                  const videoElement = e.target;
                                  try {
                                    // Pause immediately
                                    videoElement.pause();

                                    // If we have a captured thumbnail, use it
                                    if (videoThumbnails[item.id]) {
                                      handleImageLoad(item.id);
                                    } else {
                                      // Try to capture thumbnail
                                      await handleVideoLoaded(
                                        item.id,
                                        videoElement,
                                      );
                                    }
                                  } catch (error) {
                                    console.error("Error in canplay:", error);
                                    handleImageLoad(item.id);
                                  }
                                }}
                                onError={(e) => {
                                  console.error("Video error:", e);
                                  handleImageLoad(item.id);
                                }}
                              >
                                <source src={item.videoUrl} type="video/mp4" />
                              </video>

                              {/* نمایش thumbnail اگر وجود دارد */}
                              {videoThumbnails[item.id] ? (
                                <img
                                  src={videoThumbnails[item.id]}
                                  alt={item.displayTitle}
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                              ) : (
                                // Fallback image
                                <LazyLoadImage
                                  src={item.src || "/video-placeholder.jpg"}
                                  alt={item.displayTitle}
                                  effect="blur"
                                  className="w-full h-full object-cover"
                                  afterLoad={() => handleImageLoad(item.id)}
                                  beforeLoad={() =>
                                    handleImageStartLoad(item.id)
                                  }
                                />
                              )}

                              {/* Play Button */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-300">
                                  <div className="w-12 h-12 bg-black/70 rounded-full flex items-center justify-center">
                                    {item.hasYouTubeLink ? (
                                      <Youtube className="w-6 h-6 text-white" />
                                    ) : (
                                      <Play className="w-6 h-6 text-white ml-1" />
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Video Badge */}
                              <div className="absolute top-4 left-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg">
                                  <Film className="w-3 h-3 text-white" />
                                  <span className="text-white text-xs font-bold">
                                    {item.hasYouTubeLink ? "YOUTUBE" : "VIDEO"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Image Thumbnail */}
                            <LazyLoadImage
                              src={item.src || "/placeholder.jpg"}
                              alt={item.displayTitle}
                              effect="blur"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              afterLoad={() => handleImageLoad(item.id)}
                              beforeLoad={() => handleImageStartLoad(item.id)}
                            />

                            {/* Image Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                            {/* Image Badge */}
                            <div className="absolute top-4 left-4">
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg">
                                <ImageIcon className="w-3 h-3 text-white" />
                                <span className="text-white text-xs font-bold">
                                  IMAGE
                                </span>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                          <div className="space-y-2">
                            <h3 className="text-white font-bold text-lg truncate text-center">
                              {item.displayTitle}
                            </h3>
                            <div className="flex items-center justify-center gap-4">
                              {item.displayYear && (
                                <span className="text-gray-200 text-sm">
                                  {item.displayYear}
                                </span>
                              )}
                              {item.SubCategory && (
                                <span className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white">
                                  {item.SubCategory.title}
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
            {filteredProjects.length > 6 &&
              visibleCount < filteredProjects.length && (
                <div className="text-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    className="group px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-600 hover:to-cyan-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <span>Load More Interviews</span>
                    <ChevronDown className="transform group-hover:translate-y-1 transition-transform" />
                  </button>
                  <p className="text-gray-500 text-sm mt-3">
                    Showing {visibleCount} of {filteredProjects.length}{" "}
                    interviews
                  </p>
                </div>
              )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Film className="text-gray-400 text-4xl" />
            </div>
            <p className="text-gray-500 text-xl font-medium">
              No interviews found in this category
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

export default InterviewPage;
