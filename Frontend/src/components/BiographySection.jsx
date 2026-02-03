import React, { useState, useRef } from "react";
import {
  FaPalette,
  FaBook,
  FaAward,
  FaGraduationCap,
  FaUsers,
  FaGlobe,
  FaHandsHelping,
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { IoIosArrowRoundUp } from "react-icons/io";

const BiographySection = () => {
  const [expanded, setExpanded] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  const [showVideoControls, setShowVideoControls] = useState(false);
  const videoRef = useRef(null);

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setVideoPlaying(!videoPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setVideoMuted(!videoMuted);
    }
  };

  const biographyText = `
  Hamidreza Khajehmohammadi is an Iranian visual artist (painter, graphic designer, and illustrator of children's and young adult books) with more than three decades of professional experience in artistic creation, art education, and cultural, social, and humanitarian activities. Due to his continuous engagement in the fields of child rights, peace education, and working with children and adolescents, he is widely recognized as a "Peace Artist" and a child rights advocate, and is regarded as one of the prominent figures in children's art and art education in Iran.
He holds a Bachelor's degree in Graphic Design from the University of Art in Tehran and has been awarded both the "Second-Class Artistic Degree" (equivalent to a Master's degree) and the "First-Class Artistic Degree" (equivalent to a Doctorate) by the Iranian Artists Evaluation Council. Hamidreza Khajehmohammadi served for fifteen years as an art professor at Iranian art universities, including the University of Art in Tehran and the Islamic Azad University in Tehran and Mashhad. Alongside his academic teaching, he played an active role in academic and cultural development, as well as in defending students' professional rights and freedom of expression.

He is the founder and managing director of the "Khajehmohammadi Cultural and Artistic Institute," officially licensed by Iran's Ministry of Culture and Islamic Guidance, and also served as the director of a specialized watercolor painting school. Within these institutions, he organized extensive educational programs, specialized workshops, cultural and artistic forums, and activities focused on freedom of expression and the defense of human rights. He is also the founder and director of a "Social Counseling Center with a Child Art Therapy Approach," licensed by the State Welfare Organization of Iran, and collaborated closely with the Institute for the Intellectual Development of Children and Young Adults (Kanoon).

Hamidreza Khajehmohammadi has illustrated more than forty titles of children's and young adult books and has created dozens of posters, graphic works, and paintings. His works have been exhibited in numerous national and international exhibitions and have received various awards and certificates of appreciation. A number of his artworks are held in private and institutional collections in Iran and abroad. 
Many of his child and adolescent students have won dozens of gold, silver, and bronze medals at prestigious international children's painting biennials in different countries, reflecting the profound educational and formative impact of his work.
His artistic practice is not confined to a single medium or discipline; it also encompasses architectural design and sketching, urban elements, sculpture, children's theater, writing, and music. This interdisciplinary approach is a defining characteristic of his artistic journey.

Due to his political background and his cultural, artistic, and human rights activities, Hamidreza Khajehmohammadi faced professional restrictions and a ban on his activities in Iran, and in 2016 (1395 in the Iranian calendar) he was forced to leave the country. After entering Afghanistan, he registered with the Office of the United Nations High Commissioner for Refugees (UNHCR) and has been officially recognized as a refugee. Over nearly ten years of residence in Afghanistan, as an artist at risk, he has continued his artistic, educational, and humanitarian activities despite harsh conditions, insecurity, and ongoing threats.

In Afghanistan, he is also known as a "Peace Artist" and has carried out more than thirty free educational and artistic programs for children, adolescents, war-affected and marginalized families, as well as women. Part of his painting work during this period reflects his lived experience of displacement, insecurity, and deep human and human rights concerns, particularly in the field of children's rights.

Hamidreza Khajehmohammadi was born in Mashhad, Iran, and today, at the age of 68, he is an artist with a lifetime of experience, knowledge, and human commitment, who views art as a tool for education, peacebuilding, the defense of children's rights, and the preservation of human dignity. This website has been designed to introduce a selection of his artistic and educational activities and to facilitate professional communication with international cultural, artistic, and human rights institutions.
  `;

  const keyAchievements = [
    {
      icon: <FaBook className="text-amber-500" />,
      title: "Illustrated Books",
      count: "40+",
      description: "Children's and young adult books",
    },
    {
      icon: <FaPalette className="text-cyan-500" />,
      title: "Art Exhibitions",
      count: "50+",
      description: "National & International",
    },
    {
      icon: <FaGraduationCap className="text-purple-500" />,
      title: "Teaching Years",
      count: "15",
      description: "At Iranian universities",
    },
    {
      icon: <FaUsers className="text-emerald-500" />,
      title: "Humanitarian Initiatives",
      count: "30+",
      description: "Free programs in Afghanistan",
    },
    {
      icon: <FaAward className="text-rose-500" />,
      title: "Artistic Recognition",
      count: "First-Class",
      description: "Doctorate equivalent degree",
    },
    {
      icon: <FaHandsHelping className="text-indigo-500" />,
      title: "Peace Artist",
      count: "UNHCR",
      description: "Recognized refugee artist",
    },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white to-amber-50/30 py-16 md:py-24">
      {/* Background Decorations */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-cyan-400"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-700">
                Biography
              </span>
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-amber-400"></div>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A lifetime dedicated to art, education, and humanitarian work
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Biography Text */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-md shadow-xl border border-gray-100 overflow-hidden p-6 md:p-8">
              {/* Bio Header */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Biography of Hamidreza Khajehmohammadi
                </h3>
              </div>

              {/* Biography Content */}
              <div className="space-y-6">
                <div
                  className={`text-gray-700 leading-relaxed ${expanded ? "" : "line-clamp-6"}`}
                >
                  {expanded ? (
                    <div className="space-y-6">
                      {biographyText.split("\n\n").map((paragraph, index) => (
                        <p key={index} className="mb-4 text-lg">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-lg">{biographyText.split("\n\n")[0]}</p>
                  )}
                </div>

                {/* Read More Button */}
                <div className="pt-4">
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="group px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                  >
                    <span>
                      {expanded ? "Show Less" : "Read Full Biography"}
                    </span>
                    <IoIosArrowRoundUp
                      className={`transform transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                      size={20}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Key Achievements Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {keyAchievements.map((achievement, index) => (
                <div
                  key={index}
                  className="bg-white rounded-md px-5 py-8 md:py-5 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm">
                      {achievement.icon}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">
                          {achievement.count}
                        </span>
                        <span className="text-sm font-semibold text-gray-600">
                          {achievement.title}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Image and Video */}
          <div className="flex flex-col gap-6">
            {/* Image Card */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-500">
              <img
                src="home.jpg"
                alt="Hamidreza in studio"
                className="w-full  object-contain transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white font-semibold text-lg">
                  Studio Session
                </p>
                <p className="text-gray-200 text-sm">Artist at work</p>
              </div>
            </div>

            {/* Video Card with Player Controls - No overlay initially */}
            <div
              className="relative overflow-hidden rounded-xl shadow-lg border border-gray-200 group"
              onMouseEnter={() => setShowVideoControls(true)}
              onMouseLeave={() => setShowVideoControls(false)}
            >
              <video
                ref={videoRef}
                src="hero.mp4"
                muted={videoMuted}
                preload="metadata"
                playsInline
                className="w-full h-64 object-cover"
                onLoadedMetadata={(e) => {
                  e.currentTarget.currentTime = 0.1;
                }}
                onPlay={() => setVideoPlaying(true)}
                onPause={() => setVideoPlaying(false)}
              />

              {/* Play button overlay - only when video is paused */}
              {!videoPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-transparent to-transparent">
                  <button
                    onClick={toggleVideoPlay}
                    className="bg-white/90 hover:bg-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 transform"
                  >
                    <FaPlay className="text-gray-900 ml-1" size={24} />
                  </button>
                </div>
              )}

              {/* Video Controls Overlay - Show on hover or when video is playing */}
              {(showVideoControls || videoPlaying) && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300">
                  {/* Top status bar */}
                  <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      <div
                        className={`w-2 h-2 rounded-full ${videoPlaying ? "bg-emerald-400" : "bg-amber-400"}`}
                      ></div>
                      <span>{videoPlaying ? "Playing" : "Paused"}</span>
                      <span className="text-gray-300">•</span>
                      <span>{videoMuted ? "Muted" : "Sound on"}</span>
                    </div>

                    {/* Mute/Unmute Button */}
                    <button
                      onClick={toggleMute}
                      className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    >
                      {videoMuted ? (
                        <FaVolumeMute size={18} />
                      ) : (
                        <FaVolumeUp size={18} />
                      )}
                    </button>
                  </div>

                  {/* Center play/pause button */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <button
                      onClick={toggleVideoPlay}
                      className="bg-white/90 hover:bg-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
                    >
                      {videoPlaying ? (
                        <FaPause className="text-gray-900" size={24} />
                      ) : (
                        <FaPlay className="text-gray-900 ml-1" size={24} />
                      )}
                    </button>
                  </div>

                  {/* Bottom controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-semibold">
                          Artistic Journey
                        </p>
                        <p className="text-gray-300 text-sm">Watch the story</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={toggleVideoPlay}
                          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-lg transition-colors"
                        >
                          {videoPlaying ? (
                            <FaPause size={16} />
                          ) : (
                            <FaPlay size={16} />
                          )}
                        </button>
                        <button
                          onClick={toggleMute}
                          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-lg transition-colors"
                        >
                          {videoMuted ? (
                            <FaVolumeMute size={16} />
                          ) : (
                            <FaVolumeUp size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Always visible play indicator when video is not playing */}
              {!videoPlaying && !showVideoControls && (
                <div className="absolute bottom-4 right-4">
                  <div className="bg-black/60 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    <FaPlay size={12} />
                    <span>Click to play</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-white rounded-md shadow-sm border mt-8 border-gray-100 p-6">
          <h4 className="text-xl font-bold text-center md:text-start text-gray-900 mb-6 pb-3 border-b border-gray-100">
            Career Timeline
          </h4>
          <div className="flex justify-center md:justify-between gap-5 flex-wrap items-center">
            {[
              {
                year: "1990s",
                event: "Teaching at Iranian universities",
                color: "bg-amber-100 text-amber-700",
              },
              {
                year: "2010",
                event: "First-class artistic degree awarded",
                color: "bg-purple-100 text-purple-700",
              },
              {
                year: "2016",
                event: "Relocation to Afghanistan",
                color: "bg-emerald-100 text-emerald-700",
              },
              {
                year: "Present",
                event: "UNHCR recognized peace artist",
                color: "bg-rose-100 text-rose-700",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex border flex-col h-[120px] w-[320px] text-center items-center gap-4 group hover:bg-gray-50 p-3 rounded-xl transition-colors duration-200"
              >
                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${item.color}`}
                >
                  {item.year}
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 font-medium">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiographySection;
