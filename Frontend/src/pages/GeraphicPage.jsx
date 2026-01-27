import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaPalette,
  FaSpinner,
  FaBrush,
  FaArrowDown,
  FaFilter,
} from "react-icons/fa";
import GeraphicModal from "./components/GeraphicPage/GeraphicModal";
import GraphicCard from "./components/GeraphicPage/GeraphicCart";

const GraphicPage = () => {
  /* ================= STATES ================= */
  const [loading, setLoading] = useState(true);
  const [graphicProjects, setGraphicProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [activeSub, setActiveSub] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);
  const [imageLoading, setImageLoading] = useState({});

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/projects");
      const projects = res.data || [];

      // Filter graphic projects
      const graphic = projects.filter((p) => {
        if (!p.Category || !p.Category.title) return false;

        const categoryTitle = p.Category.title.toLowerCase().trim();
        const possibleNames = [
          "گرافیک",
          "graphic",
          "graphics",
          "طراحی گرافیک",
          "graphic design",
          "poster",
          "پوستر",
          "logo",
          "لوگو",
          "illustration",
          "تصویرسازی",
        ];

        return possibleNames.some((name) => categoryTitle.includes(name));
      });

      console.log("Graphic projects:", graphic.length);

      setGraphicProjects(graphic);
      setFilteredProjects(graphic);

      // Extract subcategories
      const subs = graphic
        .map((p) => p.SubCategory)
        .filter((s) => s && (s.id || s.title))
        .map((s) => ({
          id: s.id || s.title,
          title: s.title,
          count: graphic.filter(
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
        filterBySubCategory(uniqueSubs[0]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER BY SUB CATEGORY ================= */
  const filterBySubCategory = useCallback(
    (sub) => {
      if (!sub) return;

      setActiveSub(sub.id);
      setVisibleCount(9);

      const filtered = graphicProjects.filter((p) => {
        if (!p.SubCategory) return false;
        return p.SubCategory.id === sub.id || p.SubCategory.title === sub.title;
      });

      setFilteredProjects(filtered);
    },
    [graphicProjects],
  );

  /* ================= LOAD MORE ================= */
  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 9, filteredProjects.length));
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
            Loading graphic artworks...
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
          <div className="absolute inset-0 bg-[url('/gr.JPG')] bg-cover bg-center" />
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
                Graphic Design Collection
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Visual Communication
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-cyan-300 mt-3">
                Hamidreza Khajehmohammadi
              </span>
            </h1>

            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-200 leading-relaxed mb-10">
              Four decades of graphic design work blending Persian art
              traditions with modern design principles
            </p>
          </motion.div>
        </div>
      </div>

      {/* ================= INTRODUCTION SECTION ================= */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            <span className="bg-gradient-to-r from-amber-600 to-cyan-600 bg-clip-text text-transparent">
              Graphic Design: Visual Language of Ideas
            </span>
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-cyan-400 rounded-full mx-auto mb-8"></div>

          <p className="text-lg text-gray-700 leading-relaxed mb-10 max-w-3xl mx-auto">
            The graphic works of Hamidreza Khajehmohammadi represent a unique
            fusion of Persian artistic heritage with contemporary design
            principles. Each poster, logo, and illustration tells a story,
            conveys a message, or captures an emotion through carefully crafted
            visual elements.
          </p>

          {/* ================= FILTER SECTION ================= */}
          {subCategories.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-center gap-2 mb-6">
                <FaFilter className="text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-700">
                  Filter by Category
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

      {/* ================= GRAPHIC WORKS GRID ================= */}
      <div className="container max-w-7xl mx-auto px-4 pb-12 md:pb-20">
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
                      {/* Loading skeleton */}
                      {imageLoading[item.id] && (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-2xl z-10 flex items-center justify-center">
                          <FaSpinner className="text-gray-400 animate-spin text-2xl" />
                        </div>
                      )}
                      <GraphicCard
                        item={item}
                        openModal={openModal}
                        onImageLoad={() => handleImageLoad(item.id)}
                        onImageStartLoad={() => handleImageStartLoad(item.id)}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Load More Button - Show after 9 items */}
            {filteredProjects.length > 9 &&
              visibleCount < filteredProjects.length && (
                <div className="text-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    className="group px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-600 hover:to-cyan-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <span>Load More Works</span>
                    <FaArrowDown className="transform group-hover:translate-y-1 transition-transform" />
                  </button>
                  <p className="text-gray-500 text-sm mt-3">
                    Showing {visibleCount} of {filteredProjects.length} graphic
                    works
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
              No graphic works found in this category
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
            ></div>
            <GeraphicModal selectedItem={selectedItem} closeModal={closeModal} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GraphicPage;
