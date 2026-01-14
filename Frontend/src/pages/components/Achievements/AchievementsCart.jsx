import { Calendar } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

const AchievementsCart = ({ item, itemVariants, openModal, Icon }) => {
  // Get category type for styling
  const getCategoryType = () => {
    if (!item.SubCategory || !item.SubCategory.title) return "award";

    const title = item.SubCategory.title.toLowerCase();
    if (title.includes("تقدیر") || title.includes("certificate"))
      return "certificate";
    if (title.includes("نمایشگاه") || title.includes("exhibition"))
      return "exhibition";
    if (
      title.includes("جایزه") ||
      title.includes("award") ||
      title.includes("نشان")
    )
      return "award";
    return "award";
  };

  const categoryType = getCategoryType();

  // Category styling
  const categoryStyles = {
    award: {
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200",
      textColor: "text-amber-700",
    },
    certificate: {
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
    },
    exhibition: {
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
    },
  };

  const styles = categoryStyles[categoryType];

  // Get year
  const getYear = () => {
    if (item.date) return item.date;
    if (item.createdAt) {
      return new Date(item.createdAt).getFullYear().toString();
    }
    if (item.year) return item.year;
    if (item.displayYear) return item.displayYear;
    return "نامشخص";
  };

  // Get organizer
  const getOrganizer = () => {
    if (item.organizer) return item.organizer;
    if (item.exhibitionName) return item.exhibitionName;
    if (item.displayOrganizer) return item.displayOrganizer;
    return "نامشخص";
  };

  // Get title
  const getTitle = () => {
    return item.title || "بدون عنوان";
  };

  // Get description
  const getDescription = () => {
    return item.description || item.fullDescription || "بدون توضیحات";
  };
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

  return (
    <motion.div
      variants={itemVariants}
      layout
      className={`group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border ${styles.borderColor} hover:border-cyan-300`}
      onClick={openModal}
    >
      {/* Image */}
      <div className="h-48 w-full overflow-hidden relative">
        {item.image || item.mainImage ? (
          <img
            src={imageUrl}
            alt={getTitle()}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.innerHTML = `
                <div class="w-full h-full ${
                  styles.bg
                } flex flex-col items-center justify-center p-4">
                  <div class="w-12 h-12 ${
                    styles.iconBg
                  } rounded-full flex items-center justify-center mb-3">
                    <div class="${styles.iconColor}">
                      ${Icon ? `<Icon class="w-6 h-6" />` : ""}
                    </div>
                  </div>
                  <p class="${
                    styles.textColor
                  } text-sm font-medium text-center">${
                item.SubCategory?.title || "دستاورد"
              }</p>
                </div>
              `;
            }}
          />
        ) : (
          <div
            className={`w-full h-full ${styles.bg} flex flex-col items-center justify-center p-4`}
          >
            <div
              className={`w-12 h-12 ${styles.iconBg} rounded-full flex items-center justify-center mb-3`}
            >
              {Icon && <Icon className={`w-6 h-6 ${styles.iconColor}`} />}
            </div>
            <p
              className={`${styles.textColor} text-sm font-medium text-center`}
            >
              {item.SubCategory?.title || "دستاورد"}
            </p>
          </div>
        )}

        {/* Category Badge */}
        {item.SubCategory?.title && (
          <div className="absolute top-3 left-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                categoryType === "award"
                  ? "bg-amber-500"
                  : categoryType === "certificate"
                  ? "bg-blue-500"
                  : "bg-purple-500"
              }`}
            >
              {item.SubCategory.title}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-12 h-12 rounded-xl ${styles.iconBg} flex items-center justify-center flex-shrink-0`}
          >
            {Icon && <Icon className={`w-6 h-6 ${styles.iconColor}`} />}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-cyan-600 transition-colors line-clamp-2">
              {getTitle()}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{getYear()}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {getDescription()}
        </p>

        <div className="text-sm font-medium text-gray-500 truncate">
          {getOrganizer()}
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementsCart;
