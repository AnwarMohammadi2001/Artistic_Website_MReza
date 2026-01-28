import React, { useState } from "react";
import {
  FaPalette,
  FaBook,
  FaAward,
  FaGraduationCap,
  FaUsers,
  FaGlobe,
  FaHandsHelping,
} from "react-icons/fa";
import { IoIosArrowRoundUp } from "react-icons/io";

const BiographySection = () => {
  const [expanded, setExpanded] = useState(false);

  const biographyText = `
    Hamidreza Khajehmohammadi is an Iranian visual artist—painter, graphic designer, and illustrator of children's and young adult books—with more than three decades of professional experience in art creation and art education. Owing to his sustained efforts in defending children's rights, he is also recognized as a Peace Artist and children's rights activist, and is regarded as one of the well-known figures in the field of art education for children and adolescents in Iran.

    He holds a Bachelor's degree in Graphic Design from the University of Art in Tehran and has been awarded the Second-Class Artistic Degree (equivalent to a bachelor's degree) and the First-Class Artistic Degree (equivalent to a doctorate) by the Iranian Artists Evaluation Council. Hamidreza Khajehmohammadi taught art for fifteen years at Iranian art universities and, alongside his academic teaching, played an active role in cultural development as well as in advocating for students' educational and professional rights.

    He is the founder and managing director of the Khajehmohammadi Cultural and Artistic Institute, officially licensed by Iran's Ministry of Culture and Islamic Guidance, and also served as the director of a Watercolor Painting School. Within these institutions, he organized extensive activities including art education programs, specialized classes and workshops, and cultural and artistic forums focused on freedom of expression, culture, art, and human rights. He also established and managed a Social Counseling Center with a focus on Children's Art Therapy, licensed by the Iranian State Welfare Organization. Additionally, he collaborated with the Institute for the Intellectual Development of Children and Young Adults in Iran.

    Hamidreza Khajehmohammadi has illustrated more than forty children's and young adult books and has created dozens of posters and other graphic works. His artworks have been exhibited in numerous national and international exhibitions and have received recognition and awards. Some of his works are preserved in artistic collections and museums in Iran and abroad. His child and adolescent students have won gold, silver, and bronze medals in dozens of prestigious international children's art biennials in various countries—an achievement that reflects his significant impact on nurturing the new generation of Iranian artists.

    His artistic practice is not confined to a single medium or discipline; it also encompasses architectural design and sketching, urban architectural elements, sculpture, children's theater, writing, and music. This interdisciplinary approach is one of the defining characteristics of his artistic career.

    Due to his political background and cultural and human rights activities, Hamidreza Khajehmohammadi faced professional restrictions in Iran and was forced to leave the country in 2016. After relocating to Afghanistan, he registered with and was officially recognized as a refugee by the Office of the United Nations High Commissioner for Refugees (UNHCR). During nearly ten years of residence in Afghanistan, despite severe hardships and security threats, he has continued his artistic, educational, and humanitarian activities.

    In Afghanistan, he is also known as a "Peace Artist" and has carried out more than thirty free artistic and educational initiatives for children, adolescents, and underprivileged and war-affected families. A portion of his paintings from this period reflects his lived experience in Afghanistan and his deep humanitarian and human rights concerns.

    Hamidreza Khajehmohammadi was born in Mashhad, Iran, and today, at the age of 68, he is an artist with a lifetime of experience, knowledge, and human commitment—viewing art as a tool for education, peacebuilding, the defense of children's rights, and human dignity.
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
            <div className="bg-white rounded-md shadow-xl border  border-gray-100 overflow-hidden p-6 md:p-8">
              {/* Bio Header */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Biography of Hamidreza Khajehmohammadi
                </h3>
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-4 py-2 bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 font-semibold rounded-full text-sm">
                    Painter
                  </span>
                  <span className="px-4 py-2 bg-gradient-to-r from-cyan-100 to-cyan-50 text-cyan-700 font-semibold rounded-full text-sm">
                    Graphic Designer
                  </span>
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 font-semibold rounded-full text-sm">
                    Illustrator
                  </span>
                </div>
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
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
              {keyAchievements.map((achievement, index) => (
                <div
                  key={index}
                  className="bg-white rounded-md p-5 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
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

          {/* Right Column - Image and Highlights */}
          <div className="space-y-8">
            {/* Main Image Card */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-200/50 to-cyan-200/50 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-gray-200/80">
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img
                    src="hero.jpeg"
                    alt="Hamidreza Khajehmohammadi in his studio"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <div className="text-white font-bold text-lg">
                      In Studio
                    </div>
                    <div className="text-white/80 text-sm">
                      Artistic Process
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Highlights */}
          </div>
        </div>
        <div className="bg-white rounded-md shadow-sm border mt-5 border-gray-100 p-6">
          <h4 className="text-xl font-bold text-center md:text-start text-gray-900 mb-6 pb-3 border-b border-gray-100">
            Career Timeline
          </h4>
          <div className=" flex justify-center md:justify-between gap-5 flex-wrap items-center">
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
