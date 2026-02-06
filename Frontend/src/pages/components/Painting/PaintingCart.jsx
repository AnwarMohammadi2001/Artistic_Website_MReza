import { Calendar, Palette, Ruler, ZoomIn } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const PaintingCart = ({ painting, openModal, itemVariants }) => {
  // Get image URL
  const getImageUrl = () => {
    if (!painting.mainImage) return null;

    // If already a full URL
    if (painting.mainImage.startsWith("http")) {
      return painting.mainImage;
    }

    // Check if it starts with /uploads/
    if (painting.mainImage.startsWith("/uploads/")) {
      return `${BASE_URL}${painting.mainImage}`;
    }

    // If it's just a filename
    if (painting.mainImage.includes("uploads")) {
      return `${BASE_URL}/${painting.mainImage}`;
    }

    // Default case
    return `${BASE_URL}/uploads/projects/${painting.mainImage}`;
  };

  const imageUrl = getImageUrl();

  // Format date
  const formatDate = () => {
    if (painting.date) return painting.date;
    if (painting.createdAt) {
      return new Date(painting.createdAt).getFullYear().toString();
    }
    if (painting.year) {
      return painting.year;
    }
    return "بدون تاریخ";
  };

  // Get dimensions/size
  const getDimensions = () => {
    if (painting.size) return painting.size;
    if (painting.dimensions) return painting.dimensions;
    return null;
  };

  // Get technique
  const getTechnique = () => {
    if (painting.technique) return painting.technique;
    return null;
  };

  // Get category
  const getCategory = () => {
    if (painting.SubCategory && painting.SubCategory.title) {
      return painting.SubCategory.title;
    }
    if (painting.Category && painting.Category.title) {
      return painting.Category.title;
    }
    return "نقاشی";
  };

  return (
    <motion.div
     
      layout
      className="group relative bg-white rounded-md shadow-lg  hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 cursor-pointer"
      onClick={() => openModal(painting)}
    >
      {/* Painting Image */}
      <div className="relative h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={painting.title || "تصویر نقاشی"}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.innerHTML = `
                <div class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span class="text-gray-500">خطا در بارگذاری تصویر</span>
                </div>
              `;
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-gray-500">بدون تصویر</span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
          <div className="transform translate-y-4 group-hover:translate-y-0 flex flex-col items-center transition-transform duration-300">
            <ZoomIn className="w-12 h-12 text-white" />
            <p className="text-white mt-2 font-medium">View</p>
          </div>
        </div>
      </div>

      {/* Painting Info */}
      {/* <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-cyan-600 transition-colors line-clamp-1">
            {painting.title || "بدون عنوان"}
          </h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
            {getCategory()}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-6 line-clamp-2">
          {painting.description || painting.fullDescription || "بدون توضیحات"}
        </p>

        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span>{formatDate()}</span>
          </div>

          {getDimensions() && (
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span>{getDimensions()}</span>
            </div>
          )}

          {getTechnique() && (
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span>{getTechnique()}</span>
            </div>
          )}
        </div>
      </div> */}
    </motion.div>
  );
};

export default PaintingCart;
