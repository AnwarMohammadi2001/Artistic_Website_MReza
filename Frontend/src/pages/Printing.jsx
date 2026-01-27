import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../utils/axiosInstance";
import PaintingCart from "./components/Painting/PaintingCart";
import PaintingModal from "./components/Painting/PaintingModal";
import { FaPalette, FaSpinner } from "react-icons/fa";

const Printing = () => {
  /* ================= STATES ================= */
  const [loading, setLoading] = useState(true);
  const [paintingProjects, setPaintingProjects] = useState([]);
  const [afghanistanProjects, setAfghanistanProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [activeSub, setActiveSub] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [imageLoading, setImageLoading] = useState({});

  // Function to get proper image URL
  const getImageUrl = (project) => {
    if (!project) return "/placeholder.jpg";

    // Check if project has mainImage
    if (project.mainImage) {
      if (project.mainImage.startsWith("http")) {
        return project.mainImage;
      }

      if (project.mainImage.startsWith("/uploads/")) {
        return `http://localhost:5000${project.mainImage}`;
      }

      return `http://localhost:5000/uploads/projects/${project.mainImage}`;
    }

    // Check if project has images array
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

    // Default placeholder
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

      // Separate Afghanistan and other paintings
      const afgPaintings = [];
      const otherPaintings = [];

      projects.forEach((project) => {
        if (!project.Category || !project.Category.title) return;

        const categoryTitle = project.Category.title.toLowerCase().trim();

        // Check if it's an Afghanistan painting
        if (categoryTitle.includes("afghanistan")) {
          afgPaintings.push(project);
        }
        // Check if it's a painting (excluding Afghanistan)
        else if (
          categoryTitle.includes("نقاشی") ||
          categoryTitle.includes("painting") ||
          categoryTitle.includes("paintings") ||
          categoryTitle.includes("نقاشي") ||
          categoryTitle.includes("رنگ‌روغن") ||
          categoryTitle.includes("آبرنگ") ||
          categoryTitle.includes("نگارگری") ||
          categoryTitle.includes("abstract") ||
          categoryTitle.includes("oil") ||
          categoryTitle.includes("watercolor")
        ) {
          otherPaintings.push(project);
        }
      });

      console.log("Afghanistan paintings:", afgPaintings);
      console.log("Other paintings:", otherPaintings.length);

      setAfghanistanProjects(afgPaintings);
      setPaintingProjects(otherPaintings);
      setFilteredProjects(otherPaintings);

      // Extract unique subcategories from other paintings
      const subs = otherPaintings
        .map((p) => p.SubCategory)
        .filter((s) => s && (s.id || s.title))
        .map((s) => ({
          id: s.id || s.title,
          title: s.title,
          count: otherPaintings.filter(
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

      // Activate first subcategory if exists
      if (uniqueSubs.length > 0) {
        setActiveSub(uniqueSubs[0].id);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER BY SUB CATEGORY ================= */
  const handleSubCategory = useCallback(
    (sub) => {
      setActiveSub(sub.id);
      setVisibleCount(8);

      const filtered = paintingProjects.filter((p) => {
        if (!p.SubCategory) return false;
        return p.SubCategory.id === sub.id || p.SubCategory.title === sub.title;
      });

      setFilteredProjects(filtered);
    },
    [paintingProjects],
  );

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
  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 8, filteredProjects.length));
  };

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
          <p className="mt-6 text-gray-600 font-medium">Loading artworks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/20">
      {/* ================= HERO SECTION ================= */}
      <div className="relative overflow-hidden ">
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
                Paintings Collection
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Artistic Journey
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-cyan-300 mt-3">
                Hamidreza Khajehmohammadi
              </span>
            </h1>

            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-200 leading-relaxed mb-10">
              Four decades of artistic creation blending Islamic traditions with
              contemporary abstract expressions
            </p>
          </motion.div>
        </div>
      </div>

      {/* ================= INTRODUCTION SECTION ================= */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            <span className="bg-gradient-to-r from-amber-600 to-cyan-600 bg-clip-text text-transparent">
              Painting: The Silent Language of Emotions
            </span>
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-cyan-400 rounded-full mx-auto mb-8"></div>

          <p className="text-lg text-gray-700 leading-relaxed mb-10 max-w-3xl mx-auto">
            The paintings of Hamidreza Khajehmohammadi represent a fusion of
            ancient Persian artistic traditions and contemporary innovations.
            Each artwork narrates stories of life, struggle, hope, and beauty.
            From Islamic paintings with traditional gold leaf techniques to
            contemporary abstract works, all demonstrate the depth of the
            artist's vision and mastery of various styles.
          </p>

          {/* ================= SUB CATEGORIES FILTER ================= */}
          {subCategories.length > 0 && (
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">
                Browse by Category
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {subCategories.map((sub) => {
                  const isActive = activeSub === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleSubCategory(sub)}
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

      {/* ================= PAINTINGS GRID ================= */}
      <div className="container  px-4 max-w-7xl mx-auto pb-12 md:pb-20">
        {filteredProjects.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSub}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8"
              >
                {filteredProjects.slice(0, visibleCount).map((item) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <div className="relative">
                      {imageLoading[item.id] && (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-2xl z-10 flex items-center justify-center">
                          <FaSpinner className="text-gray-400 animate-spin text-2xl" />
                        </div>
                      )}
                      <PaintingCart
                        painting={item}
                        openModal={openModal}
                        onImageLoad={() => handleImageLoad(item.id)}
                        onImageStartLoad={() => handleImageStartLoad(item.id)}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {visibleCount < filteredProjects.length && (
              <div className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  className="group px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-600 hover:to-cyan-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                  <span>Load More Paintings</span>
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
                  Showing {visibleCount} of {filteredProjects.length} paintings
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FaPalette className="text-gray-400 text-4xl" />
            </div>
            <p className="text-gray-500 text-xl font-medium">
              No artworks found in this category
            </p>
          </div>
        )}
      </div>

      {/* ================= AFGHANISTAN PAINTINGS SECTION ================= */}
      {afghanistanProjects.length > 0 && (
        <div className="bg-gradient-to-b from-white to-rose-50/30 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-4 mb-6">
                <div className="w-10 h-1 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                  <span className="bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                    Afghanistan Series
                  </span>
                </h2>
                <div className="w-10 h-1 bg-gradient-to-r from-rose-400 to-amber-400 rounded-full"></div>
              </div>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                A collection created during my years in Afghanistan (
                {afghanistanProjects.length} paintings)
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-md shadow-xl border border-gray-100 p-8 md:p-10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-rose-100 to-rose-50 rounded-xl">
                    <FaPalette className="text-rose-600 text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Human Rights in Afghanistan
                  </h3>
                </div>

                <div className="space-y-6 text-gray-700 leading-relaxed">
                  <p className="text-lg">
                    The paintings I have created under the theme of Human Rights
                    in Afghanistan are based on three key elements:
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-amber-50/50 rounded-md">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full flex items-center justify-center text-white font-bold">
                        1
                      </div>
                      <p>
                        I used abstract and ambiguous lines and shapes derived
                        from traditional talismanic symbols and popular prayer
                        writings, solely as formal visual elements, detached
                        from their original function.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-rose-50/50 rounded-md">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-rose-500 to-rose-400 rounded-full flex items-center justify-center text-white font-bold">
                        2
                      </div>
                      <p>
                        I was also influenced by the symbolism of Afghan folk
                        culture, particularly the rich decorative patterns and
                        traditional motifs found in the textiles and handicrafts
                        created by Afghan women artists.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-purple-50/50 rounded-md">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                        3
                      </div>
                      <p>
                        An indirect engagement with the artistic heritage of
                        Master Kamāl al-Dīn Behzād, the genius of painting
                        history who worked within the Herat School of Miniature
                        Painting during the Timurid period.
                      </p>
                    </div>
                  </div>

                  <p className="pt-4 border-t border-gray-100 italic text-rose-700">
                    These three elements have been the primary sources of
                    inspiration for my paintings addressing human rights issues
                    in Afghanistan.
                  </p>
                </div>
              </motion.div>

              {/* Afghanistan Paintings Grid */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-2 gap-4 md:gap-6"
              >
                {afghanistanProjects.slice(0, 4).map((painting) => {
                  const imageUrl = getImageUrl(painting);

                  return (
                    <div
                      key={painting.id}
                      className="group relative overflow-hidden rounded-md bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
                    >
                      <div className="aspect-square relative overflow-hidden">
                        {imageLoading[`afg-${painting.id}`] && (
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse z-10 flex items-center justify-center">
                            <FaSpinner className="text-gray-400 animate-spin text-2xl" />
                          </div>
                        )}

                        {/* Lazy loaded image with proper URL */}
                        <img
                          src={imageUrl}
                          alt={painting.title || "Afghanistan Painting"}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          onLoad={() => handleImageLoad(`afg-${painting.id}`)}
                          onLoadStart={() =>
                            handleImageStartLoad(`afg-${painting.id}`)
                          }
                          loading="lazy"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <h4 className="text-white font-bold text-lg truncate">
                            {painting.title || "Untitled"}
                          </h4>
                          {painting.year && (
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-white/90 text-sm">
                                {painting.year}
                              </span>
                              {painting.medium && (
                                <span className="text-white/90 text-sm truncate ml-2">
                                  {painting.medium}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {afghanistanProjects.length > 4 && (
              <div className="text-center mt-12">
                <button className="group px-8 py-3 bg-gradient-to-r from-rose-500 to-rose-400 hover:from-rose-600 hover:to-rose-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 mx-auto">
                  <span>
                    View All Afghanistan Paintings ({afghanistanProjects.length}
                    )
                  </span>
                  <svg
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
            ></div>
            <PaintingModal
              selectedPainting={selectedItem}
              closeModal={closeModal}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Printing;
