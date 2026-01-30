import React, { useEffect, useState } from "react";
import { IoIosArrowRoundDown } from "react-icons/io";

const ArtistHero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  IoIosArrowRoundDown;
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative md:h-[90vh] min-h-[600px] overflow-hidden bg-gradient-to-br from-amber-50 via-white to-cyan-50">
      {/* Background Decorations */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-500"></div>
      </div>

      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-cyan-400 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-cyan-400"></div>

      <div className="relative z-10 container mx-auto h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          {/* Image Section */}
          <div
            className={`relative order-2 lg:order-1 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
          >
            <div className="relative group">
              {/* Image Frame */}
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-200/50 to-cyan-200/50 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative overflow-hidden  shadow-2xl border border-gray-200/80 backdrop-blur-sm bg-gradient-to-br from-white/80 to-gray-50/80">
                <div className="relative overflow-hidden">
                  <img
                    src="bio.jpg"
                    alt="Hamidreza Khajehmohammadi - Visual Artist and Art Director"
                    className="w-full h-full  object-contain transform group-hover:scale-105 transition-transform duration-700"
                    onLoad={() => setIsLoaded(true)}
                  />
                  {/* Image Overlay Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full text-xs font-bold text-white shadow-lg">
                    ARTIST
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-3 -left-3 w-20 h-20 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-2xl"></div>
              <div className="absolute -bottom-3 -right-3 w-20 h-20 border-b-2 border-r-2 border-amber-400/50 rounded-br-2xl"></div>
            </div>

            {/* Decorative Dots */}
            <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-amber-400/20 rounded-full blur-sm"></div>
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-cyan-400/20 rounded-full blur-sm"></div>
          </div>

          {/* Text and Biography Section */}
          <div
            className={`order-1 lg:order-2 transition-all duration-1000 pr-5 ${isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
          >
            <div className="text-center lg:text-left space-y-6 lg:space-y-8 lg:pl-8">
              {/* Name and Title */}
              <div className=" mt-5">
                <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  <span className="block">Hamidreza</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-700 mt-2">
                    Khajehmohammadi
                  </span>
                </h1>

                <div className="relative inline-block">
                  <h2 className="text-xl md:text-lg lg:text-xl font-semibold text-cyan-600 mt-4 lg:mt-6">
                    Painter • Graphic Designer • Writer • Human Rights Activist
                  </h2>
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
                </div>
              </div>

              {/* Biography Text */}
              <div className="max-w-2xl mx-auto flex flex-col items-center  lg:mx-0">
                <p className="text-lg md:text-2xl font-bold text-gray-700 leading-relaxed lg:leading-loose">
                  An Iranian artist and asylum seeker with over 30 years of
                  professional experience in art, education, and human rights
                  advocacy.
                </p>
                <button className="px-4 py-2 w-fit cursor-pointer hover:scale-102 transition-all duration-300 bg-cyan-600 flex items-center gap-x-2 rounded-full text-gray-50">
                  Read More About Me{" "}
                  <span>
                    <IoIosArrowRoundDown size={24} />
                  </span>
                </button>
              </div>

              {/* Statistics */}
              <div className="pt-4 lg:pt-4">
                <div className="flex items-center justify-center gap-4 md:gap-6">
                  {[
                    {
                      value: "40+",
                      label: "Years Experience",
                      color: "from-amber-500 to-amber-400",
                    },
                    {
                      value: "50+",
                      label: "Exhibitions",
                      color: "from-cyan-500 to-cyan-400",
                    },
                    {
                      value: "100+",
                      label: "Artworks",
                      color: "from-amber-500 to-amber-400",
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className={`group relative transition-all duration-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                      style={{ transitionDelay: `${index * 150}ms` }}
                    >
                      <div className="relative p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/70 shadow-lg overflow-hidden group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300">
                        {/* Background Effect */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                        ></div>

                        <div className="relative z-10">
                          <div
                            className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                          >
                            {stat.value}
                          </div>
                          <div className="text-gray-700 font-medium text-sm md:text-base mt-2">
                            {stat.label}
                          </div>
                        </div>

                        {/* Corner Decorations */}
                        <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-amber-400/30"></div>
                        <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-cyan-400/30"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block">
        <div className="text-gray-500 animate-bounce">
          <i className="fas fa-chevron-down text-2xl"></i>
        </div>
      </div>
    </div>
  );
};

export default ArtistHero;
