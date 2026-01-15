import React from "react";
import { motion } from "framer-motion";
import { Maximize2, Calendar, MapPin, User } from "lucide-react";

const MiscellaneousCart = ({ item, categoryInfo, itemVariants, openModal }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 h-[350px]"
      onClick={() => openModal(item)}
    >
      {/* Category Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span
          className={`bg-gradient-to-r ${categoryInfo.color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm bg-opacity-90 flex items-center gap-1`}
        >
          {categoryInfo.icon}
          {categoryInfo.label}
        </span>
      </div>

      {/* Image Container */}
      <div className="relative w-full h-2/3 overflow-hidden">
        <img
          src={
            item.images?.[0]?.url ||
            "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          }
          alt={item.title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex items-center gap-1 mb-2">
              <Maximize2 className="w-4 h-4" />
              <span className="text-xs">برای مشاهده کلیک کنید</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 h-1/3 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">
            {item.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {item.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {item.year && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{item.year}</span>
              </div>
            )}
            {item.artist && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <User className="w-3 h-3" />
                <span>{item.artist}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex gap-1">
              {item.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
              {item.tags.length > 2 && (
                <span className="text-xs text-gray-400">
                  +{item.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MiscellaneousCart;
