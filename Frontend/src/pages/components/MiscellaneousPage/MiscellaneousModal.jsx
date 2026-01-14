import React from "react";
import { motion } from "framer-motion";
import {
  X,
  Calendar,
  User,
  Tag,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

const MiscellaneousModal = ({ selectedItem, categoryInfo, closeModal }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", damping: 25 }}
      className="fixed inset-4 md:inset-10 lg:inset-20 z-50 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white rounded-3xl shadow-2xl h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200">
          <button
            onClick={closeModal}
            className="absolute left-6 top-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center pr-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div
                className={`p-2 rounded-lg bg-gradient-to-r ${categoryInfo.color}`}
              >
                {categoryInfo.icon}
              </div>
              <span
                className={`font-bold text-lg bg-gradient-to-r ${categoryInfo.color} bg-clip-text text-transparent`}
              >
                {categoryInfo.label}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {selectedItem.title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Image */}
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3]">
                <img
                  src={
                    selectedItem.images?.[0]?.url ||
                    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Image Gallery */}
              {selectedItem.images && selectedItem.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {selectedItem.images.slice(1, 5).map((img, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={img.url}
                        alt={`${selectedItem.title} - ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  توضیحات
                </h3>
                <p className="text-gray-600 leading-relaxed text-justify">
                  {selectedItem.description ||
                    "توضیحاتی برای این اثر وجود ندارد."}
                </p>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4">
                {selectedItem.year && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">سال تولید</span>
                    </div>
                    <p className="font-bold text-lg">{selectedItem.year}</p>
                  </div>
                )}

                {selectedItem.artist && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <User className="w-4 h-4" />
                      <span className="text-sm">خالق اثر</span>
                    </div>
                    <p className="font-bold text-lg">{selectedItem.artist}</p>
                  </div>
                )}

                {selectedItem.location && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">موقعیت</span>
                    </div>
                    <p className="font-bold text-lg">{selectedItem.location}</p>
                  </div>
                )}

                {selectedItem.duration && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">مدت زمان</span>
                    </div>
                    <p className="font-bold text-lg">{selectedItem.duration}</p>
                  </div>
                )}
              </div>

              {/* Tags */}
              {selectedItem.tags && selectedItem.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    برچسب‌ها
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              {selectedItem.additionalInfo && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    اطلاعات تکمیلی
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(selectedItem.additionalInfo).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                        >
                          <span className="text-gray-600">{key}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">دسته‌بندی:</span>
              <span
                className={`px-4 py-2 rounded-full bg-gradient-to-r ${categoryInfo.color} text-white font-bold`}
              >
                {categoryInfo.label}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                بستن
              </button>
              {selectedItem.link && (
                <a
                  href={selectedItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  مشاهده بیشتر
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Add missing Clock icon import
const Clock = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default MiscellaneousModal;
