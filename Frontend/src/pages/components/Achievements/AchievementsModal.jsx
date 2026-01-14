import { Calendar, X, Award, User } from "lucide-react";
import React from "react";

const AchievementsModal = ({ selectedItem, closeModal }) => {
  // Get image URL
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


  // Get year
  const getYear = () => {
    if (selectedItem.date) return selectedItem.date;
    if (selectedItem.createdAt) {
      return new Date(selectedItem.createdAt).getFullYear().toString();
    }
    if (selectedItem.year) return selectedItem.year;
    return "نامشخص";
  };

  // Get organizer
  const getOrganizer = () => {
    if (selectedItem.organizer) return selectedItem.organizer;
    if (selectedItem.exhibitionName) return selectedItem.exhibitionName;
    return "نامشخص";
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white max-w-4xl w-full rounded-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 left-4 z-50 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="md:grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="h-[400px] md:h-full">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={selectedItem.title || "تصویر دستاورد"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `
                    <div class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div class="text-center">
                        <div class="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Award class="w-8 h-8 text-gray-500" />
                        </div>
                        <p class="text-gray-500">تصویر در دسترس نیست</p>
                      </div>
                    </div>
                  `;
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-500">تصویر در دسترس نیست</p>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Category */}
            {selectedItem.SubCategory?.title && (
              <div className="inline-block px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-bold">
                {selectedItem.SubCategory.title}
              </div>
            )}

            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-800">
              {selectedItem.title || "بدون عنوان"}
            </h2>

            {/* Date and Organizer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">{getYear()}</span>
              </div>
              <div className="text-gray-700 font-medium">{getOrganizer()}</div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              {selectedItem.description && (
                <p className="text-gray-700 leading-relaxed">
                  {selectedItem.description}
                </p>
              )}

              {selectedItem.fullDescription && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-3">توضیحات کامل</h4>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedItem.fullDescription}
                  </p>
                </div>
              )}
            </div>

            {/* Additional Info */}
            {(selectedItem.location ||
              selectedItem.technique ||
              selectedItem.size) && (
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                {selectedItem.location && (
                  <div>
                    <p className="text-sm text-gray-500">مکان</p>
                    <p className="font-medium">{selectedItem.location}</p>
                  </div>
                )}
                {selectedItem.technique && (
                  <div>
                    <p className="text-sm text-gray-500">تکنیک</p>
                    <p className="font-medium">{selectedItem.technique}</p>
                  </div>
                )}
                {selectedItem.size && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">ابعاد</p>
                    <p className="font-medium">{selectedItem.size}</p>
                  </div>
                )}
              </div>
            )}

            {/* Artist Info */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">حمیدرضا خواجه محمدی</p>
                  <p className="text-sm text-gray-600">هنرمند و خالق اثر</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsModal;
