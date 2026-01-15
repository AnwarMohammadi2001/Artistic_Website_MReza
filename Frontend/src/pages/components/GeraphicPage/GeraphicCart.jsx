import { Calendar, ZoomIn } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

const GeraphicCart = ({ item, itemVariants, viewMode, openModal }) => {
  // Construct image URL directly like in Projects component
  const getImageUrl = () => {
    if (!item.mainImage) return null;

    // If already a full URL
    if (item.mainImage.startsWith("http")) {
      return item.mainImage;
    }

    // Check if it starts with /uploads/
    if (item.mainImage.startsWith("/uploads/")) {
      return `http://localhost:5000${item.mainImage}`;
    }

    // If it's just a filename
    if (item.mainImage.includes("uploads")) {
      return `http://localhost:5000/${item.mainImage}`;
    }

    // Default case
    return `http://localhost:5000/uploads/projects/${item.mainImage}`;
  };

  const imageUrl = getImageUrl();

  // Format date if needed
  const formatDate = () => {
    if (item.date) {
      return item.date;
    }
    if (item.createdAt) {
      return new Date(item.createdAt).getFullYear().toString();
    }
    if (item.year) {
      return item.year;
    }
    return "بدون تاریخ";
  };

  // Get project type from subcategory
  const getProjectType = () => {
    if (item.SubCategory && item.SubCategory.title) {
      return item.SubCategory.title;
    }
    if (item.type) {
      return item.type;
    }
    return "پروژه";
  };

  // Add this for debugging
  console.log("Item mainImage:", item.mainImage);
  console.log("Generated imageUrl:", imageUrl);

  return (
    <div
      key={item.id}
      layout
      className={`group relative cursor-pointer ${
        viewMode === "grid"
          ? "bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
          : "bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
      }`}
      onClick={() => openModal(item)}
    >
      <>
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>

          {/* Image */}
          {imageUrl ? (
            <div className="w-full h-full relative">
              <img
                src={imageUrl}
                alt={item.title || "تصویر پروژه"}
                className="w-full h-full object-cover group-hover:scale-110 rounded-md transition-transform duration-700"
                onError={(e) => {
                  console.error("Image failed to load:", imageUrl);
                  e.target.style.display = "none";
                  // Show fallback
                  const container = e.target.parentElement;
                  container.innerHTML = `
                    <div class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span class="text-gray-500">خطا در بارگذاری تصویر</span>
                    </div>
                  `;
                }}
                onLoad={() =>
                  console.log("Image loaded successfully:", imageUrl)
                }
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-gray-500">بدون تصویر</span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-center">
              <ZoomIn className="w-12 h-12 text-white mx-auto mb-2" />
              <p className="text-white font-medium">مشاهده جزئیات</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-cyan-600 transition-colors line-clamp-1">
            {item.title || "بدون عنوان"}
          </h3>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{formatDate()}</span>
            </div>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {getProjectType()}
            </span>
          </div>

          <p className="text-gray-700 text-sm mb-4 line-clamp-2">
            {item.description || item.fullDescription || "بدون توضیحات"}
          </p>
        </div>
      </>
    </div>
  );
};

export default GeraphicCart;
