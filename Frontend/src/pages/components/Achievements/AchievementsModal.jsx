import { Calendar, X } from 'lucide-react';
import React from 'react'

const AchievementsModal = ({setSelectedItem , selectedItem}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white max-w-3xl w-full flex  h-[500px] rounded-lg overflow-hidden relative">
        {/* Close */}
        <button
          onClick={() => setSelectedItem(null)}
          className="absolute top-4 left-4 text-gray-600  hover:text-red-500"
        >
          <X />
        </button>

        {/* Image */}
        <div className="h-full ">
          <img
            src={selectedItem.image}
            alt={selectedItem.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedItem.title}
          </h2>

          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            {selectedItem.year} – {selectedItem.organizer}
          </div>

          <p className="text-gray-700 leading-relaxed">
            {selectedItem.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AchievementsModal
