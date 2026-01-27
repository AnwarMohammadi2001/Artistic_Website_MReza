import { Link } from "react-router-dom";
import React, { useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import BiographySection from "../components/BiographySection";
import ArtistHero from "../components/ArtistHero";

const Biography = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const items = [
    {
      img: "p/ach.JPG",
      title: "Achievements",
      path: "/achivment",
      gradient: "from-amber-400 to-amber-300",
      hoverGradient: "from-amber-500 to-amber-400",
    },
    {
      img: "p/design.JPG",
      title: "Design",
      path: "/design",
      gradient: "from-cyan-400 to-cyan-300",
      hoverGradient: "from-cyan-500 to-cyan-400",
    },
    {
      img: "p/garaphic.jpg",
      title: "Graphic",
      path: "/graphic",
      gradient: "from-purple-400 to-purple-300",
      hoverGradient: "from-purple-500 to-purple-400",
    },
    {
      img: "p/inter.JPG",
      title: "Painting",
      path: "/painting",
      gradient: "from-rose-400 to-rose-300",
      hoverGradient: "from-rose-500 to-rose-400",
    },
    {
      img: "p/mot.JPG",
      title: "Interview",
      path: "/interview",
      gradient: "from-emerald-400 to-emerald-300",
      hoverGradient: "from-emerald-500 to-emerald-400",
    },
    {
      img: "p/painting.JPG",
      title: "Miscellaneous",
      path: "/miscellaneous",
      gradient: "from-indigo-400 to-indigo-300",
      hoverGradient: "from-indigo-500 to-indigo-400",
    },
    {
      img: "p/tet.JPG",
      title: "Exhibition",
      path: "/exhibition",
      gradient: "from-orange-400 to-orange-300",
      hoverGradient: "from-orange-500 to-orange-400",
    },
    {
      img: "p/view.jpg",
      title: "Theater",
      path: "/theater",
      gradient: "from-teal-400 to-teal-300",
      hoverGradient: "from-teal-500 to-teal-400",
    },
  ];

  return (
    <div className="">
      <ArtistHero />
      <BiographySection />

      {/* Enhanced Gallery Section */}
      <div className="py-20 bg-gradient-to-b from-white to-amber-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-4 mb-4">
              <div className="w-10 h-1 bg-gradient-to-r from-amber-400 to-cyan-400 rounded-full"></div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-700">
                <span className="bg-">
                  My Art Gallery
                </span>
              </h3>
              <div className="w-10 h-1 bg-gradient-to-r from-cyan-400 to-amber-400 rounded-full"></div>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Explore my artwork across different categories and styles
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, index) => (
              <Link
                to={item.path}
                key={item.title}
                className="group relative"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card Container */}
                <div className="relative h-[400px] overflow-hidden rounded-md shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
                  {/* Background Gradient Glow */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
                  ></div>

                  {/* Image Container */}
                  <div className="relative h-[280px] overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-4 py-1.5 bg-gradient-to-r ${item.hoverGradient} text-white text-sm font-semibold rounded-full shadow-lg`}
                      >
                        {item.title}
                      </span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 relative z-10">
                    <h4 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">
                      {item.title}
                    </h4>

                    {/* Hover Indicator */}
                    <div
                      className={`w-12 h-1 bg-gradient-to-r ${item.hoverGradient} rounded-full mb-4 transform group-hover:w-16 transition-all duration-300`}
                    ></div>

                    {/* Description & CTA */}
                    <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      <p className="text-gray-600 text-sm mb-4">
                        View my collection of artworks in this category
                      </p>

                      {/* View Button */}
                      <div className="flex items-center justify-between">
                        <button
                          className={`px-4 py-2 bg-gradient-to-r ${item.hoverGradient} text-white font-medium rounded-full text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2`}
                        >
                          View Gallery
                          <BsArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                        <span className="text-gray-500 text-sm">
                          Click to explore →
                        </span>
                      </div>
                    </div>

                    {/* Static CTA for non-hover state */}
                    <div className="opacity-100 group-hover:opacity-0 transform translate-y-0 group-hover:translate-y-4 transition-all duration-500 absolute bottom-6">
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="text-sm font-medium">
                          Explore Collection
                        </span>
                        <BsArrowRight className="text-gray-500" />
                      </div>
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${item.hoverGradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}
                  ></div>
                </div>

                {/* External Glow Effect */}
                <div
                  className={`absolute -inset-2 bg-gradient-to-r ${item.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`}
                ></div>
              </Link>
            ))}
          </div>

        
        </div>
      </div>
    </div>
  );
};

export default Biography;
