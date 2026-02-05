import React from "react";
import { motion } from "framer-motion";
import { Calendar, Palette, Ruler, User, X, MapPin, Award } from "lucide-react";
import AnimatedModal from "../../../components/common/AnimatedModal.jsx";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const PaintingModal = ({ closeModal, selectedPainting }) => {
  // Get image URL
  // Get image URL
  const getImageUrl = () => {
    if (!selectedPainting.mainImage) return null;

    // If already a full URL
    if (selectedPainting.mainImage.startsWith("http")) {
      return selectedPainting.mainImage;
    }

    // Check if it starts with /uploads/
    if (selectedPainting.mainImage.startsWith("/uploads/")) {
      return `${BASE_URL}${selectedPainting.mainImage}`;
    }

    // If it's just a filename
    if (selectedPainting.mainImage.includes("uploads")) {
      return `${BASE_URL}/${selectedPainting.mainImage}`;
    }

    // Default case
    return `${BASE_URL}/uploads/projects/${selectedPainting.mainImage}`;
  };

  const imageUrl = getImageUrl();

  // Format date
  const formatDate = () => {
    if (selectedPainting.date) return selectedPainting.date;
    if (selectedPainting.createdAt) {
      return new Date(selectedPainting.createdAt).getFullYear().toString();
    }
    if (selectedPainting.year) {
      return selectedPainting.year;
    }
    return "نامشخص";
  };

  // Get dimensions/size
  const getDimensions = () => {
    if (selectedPainting.size) return selectedPainting.size;
    if (selectedPainting.dimensions) return selectedPainting.dimensions;
    return "اندازه نامشخص";
  };

  // Get technique
  const getTechnique = () => {
    if (selectedPainting.technique) return selectedPainting.technique;
    return "تکنیک نامشخص";
  };

  // Get category
  const getCategory = () => {
    if (selectedPainting.SubCategory && selectedPainting.SubCategory.title) {
      return selectedPainting.SubCategory.title;
    }
    if (selectedPainting.Category && selectedPainting.Category.title) {
      return selectedPainting.Category.title;
    }
    return "نقاشی";
  };

  // Get location if exists
  const getLocation = () => {
    if (selectedPainting.location) return selectedPainting.location;
    if (selectedPainting.exhibitionName) return selectedPainting.exhibitionName;
    return null;
  };

  // Get organizer if exists
  const getOrganizer = () => {
    if (selectedPainting.organizer) return selectedPainting.organizer;
    if (selectedPainting.exhibitionName) return selectedPainting.exhibitionName;
    return null;
  };

  return (
    <AnimatedModal isOpen={true} onClose={closeModal} maxWidth="max-w-5xl">
      <div className="relative max-h-screen flex items-center justify-center">
        <div
          className="relative max-h-[90vh] "
          onClick={(e) => e.stopPropagation()}
        >
          <div className=" gap-8 p-4">
            {/* Left Column - Image */}
            <div className="mb-8 md:mb-0">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden h-[400px] md:h-full">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={selectedPainting.title || "تصویر نقاشی"}
                    className="w-fit h-[500px] object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML = `
                        <div class="w-full h-full flex flex-col items-center justify-center p-8">
                          <div class="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                            <Palette className="w-8 h-8 text-gray-500" />
                          </div>
                          <p class="text-gray-500 text-center">تصویر در دسترس نیست</p>
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                      <Palette className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-500 text-center">
                      تصویر در دسترس نیست
                    </p>
                  </div>
                )}
              </div>

              {/* Additional info below image */}
              {(selectedPainting.mediaType === "video" ||
                selectedPainting.link) && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-blue-600">
                    {selectedPainting.mediaType === "video"
                      ? "🎬 این یک محتوای ویدیویی است"
                      : "🔗 پیوند مرتبط موجود است"}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            {/* <div className="space-y-6">
            
              <div className="mb-2">
                <span className="inline-block px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">
                  {getCategory()}
                </span>
              </div>

           
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                {selectedPainting.title || "بدون عنوان"}
              </h2>

           
              {selectedPainting.description && (
                <p className="text-gray-600 text-lg leading-relaxed">
                  {selectedPainting.description}
                </p>
              )}

        
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
                <div className="bg-cyan-50 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-cyan-600" />
                    <span className="font-bold text-gray-700">سال خلق</span>
                  </div>
                  <p className="text-gray-800 text-lg">{formatDate()}</p>
                </div>

                <div className="bg-emerald-50 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Ruler className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-gray-700">ابعاد</span>
                  </div>
                  <p className="text-gray-800 text-lg">{getDimensions()}</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Palette className="w-5 h-5 text-purple-600" />
                    <span className="font-bold text-gray-700">تکنیک</span>
                  </div>
                  <p className="text-gray-800 text-lg">{getTechnique()}</p>
                </div>

        
                {getLocation() && (
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-gray-700">مکان</span>
                    </div>
                    <p className="text-gray-800 text-lg">{getLocation()}</p>
                  </div>
                )}

                {selectedPainting.duration && (
                  <div className="bg-amber-50 p-4 rounded-xl sm:col-span-2">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-amber-600" />
                      <span className="font-bold text-gray-700">
                        مدت زمان پروژه
                      </span>
                    </div>
                    <p className="text-gray-800 text-lg">
                      {selectedPainting.duration}
                    </p>
                  </div>
                )}
              </div>

      
              {selectedPainting.fullDescription && (
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">
                    توضیحات کامل اثر
                  </h4>
                  <div className="text-gray-700 leading-relaxed space-y-4">
                    {selectedPainting.fullDescription
                      .split("\n")
                      .map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                  </div>
                </div>
              )}

            
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-cyan-500 to-blue-600 w-12 h-12 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">
                      حمیدرضا خواجه محمدی
                    </p>
                    <p className="text-gray-600">هنرمند و خالق اثر</p>

                 
                    {selectedPainting.organizer && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                        <Award className="w-4 h-4" />
                        <span>ارائه‌دهنده: {selectedPainting.organizer}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

         
              {selectedPainting.link && (
                <div className="pt-6">
                  <a
                    href={selectedPainting.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:opacity-90 transition-opacity"
                  >
                    مشاهده اطلاعات بیشتر
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                </div>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </AnimatedModal>
  );
};

export default PaintingModal;
