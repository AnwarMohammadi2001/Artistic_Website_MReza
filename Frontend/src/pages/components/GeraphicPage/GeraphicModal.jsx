import { BookOpen, Calendar, Palette, X } from 'lucide-react';
import {motion} from  "framer-motion";
import React from 'react'

const GeraphicModal = ({ selectedItem, closeModal }) => {
    const getImageUrl = () => {
      if (!selectedItem.mainImage) return null;

      // If already a full URL
      if (selectedItem.mainImage.startsWith("http")) {
        return selectedItem.mainImage;
      }

      // Check if it starts with /uploads/
      if (selectedItem.mainImage.startsWith("/uploads/")) {
        return `http://localhost:5000${selectedItem.mainImage}`;
      }

      // If it's just a filename
      if (selectedItem.mainImage.includes("uploads")) {
        return `http://localhost:5000/${selectedItem.mainImage}`;
      }

      // Default case
      return `http://localhost:5000/uploads/projects/${selectedItem.mainImage}`;
    };

    const imageUrl = getImageUrl();
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-6 left-6 z-50 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all duration-300"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        {/* <div className="p-6 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {selectedItem.title}
              </h2>
              <p className="text-gray-600">
                برای {selectedItem.client} • {selectedItem.year}
              </p>
            </div>
          </div>
        </div> */}

        {/* Modal Body */}
        <div className=" p-6 gap-0 h-full">
          {/* Main Image */}
          <div className="lg:col-span-1 relative min-h-[400px] lg:min-h-[350px]">
            <div className="w-full h-[80vh] relative">
              <img
                src={imageUrl}
                alt={selectedItem.title || "تصویر پروژه"}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
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
          </div>

          {/* Details Sidebar */}
          {/* <div className="p-8 overflow-y-auto">
            <div className="space-y-8">
              
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-amber-600" />
                  توضیحات پروژه
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {selectedItem.fullDescription}
                </p>
              </div>

           
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-800 mb-4">
                  مشخصات فنی
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-amber-600" />
                      <span className="font-bold text-gray-700">سال تولید</span>
                    </div>
                    <p className="text-gray-800">{selectedItem.year}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Palette className="w-5 h-5 text-amber-600" />
                      <span className="font-bold text-gray-700">ابعاد</span>
                    </div>
                    <p className="text-gray-800">{selectedItem.dimensions}</p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </motion.div>
    </div>
  );
};

export default GeraphicModal
