import { Calendar } from 'lucide-react';
import React from 'react'

const AchievementsCart = ({ setSelectedItem, item, Icon }) => {
  return (
    <div
      key={item.id}
      onClick={() => setSelectedItem(item)}
      className="bg-white rounded-md shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-100"
    >
      {/* Image */}
      <div className="h-48 w-full overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <Icon className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {item.year}
            </div>
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-4">{item.description}</p>

        <div className="text-sm text-gray-500 font-medium">
          {item.organizer}
        </div>
      </div>
    </div>
  );
};

export default AchievementsCart
