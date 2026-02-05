import React from "react";
import {
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaInstagram,
  FaTelegram,
  FaYoutube,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaPinterest,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Palette,
  Brush,
  Camera,
  Theater,
  GalleryThumbnails,
  User,
  Mail,
  Phone,
  Globe,
  Heart,
  Sparkles,
  Award,
} from "lucide-react";

const Footer = () => {
  const artist = {
    name: "Hamidreza Khajehmohammadi",
    title: "Pioneer Contemporary Iranian Artist",
    bio: "An Iranian artist and asylum seeker with over 30 years of professional experience in art, education, and human rights advocacy.",
    contact: {
      whatsapp: "+93 70 582 9776",
      phone: "+93 70 582 9776",
      email: "hamid.painter.ir@gmail.com",
      studio: "Tehran, Iran",
    },
    socialLinks: [
      {
        name: "Instagram",
        url: "https://instagram.com/hamidreza.art",
        icon: <FaInstagram />,
        color:
          "hover:bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500",
      },
      {
        name: "Telegram",
        url: "https://t.me/hamidreza_channel",
        icon: <FaTelegram />,
        color: "hover:bg-gradient-to-br from-blue-500 to-blue-700",
      },
      {
        name: "YouTube",
        url: "https://youtube.com/@hamidreza_art",
        icon: <FaYoutube />,
        color: "hover:bg-gradient-to-br from-red-600 to-red-800",
      },
    ],
    quickLinks: [
      {
        name: "Exhibitions",
        url: "/exhibitions",
        icon: <GalleryThumbnails className="w-4 h-4" />,
      },
      {
        name: "Art Gallery",
        url: "/gallery",
        icon: <Palette className="w-4 h-4" />,
      },
      {
        name: "Biography",
        url: "/biography",
        icon: <User className="w-4 h-4" />,
      },
      {
        name: "Interviews",
        url: "/interviews",
        icon: <Camera className="w-4 h-4" />,
      },
      {
        name: "Theater Works",
        url: "/theater",
        icon: <Theater className="w-4 h-4" />,
      },
      {
        name: "Achievements",
        url: "/achievements",
        icon: <Award className="w-4 h-4" />,
      },
      { name: "Contact", url: "/contact", icon: <Mail className="w-4 h-4" /> },
      {
        name: "Commissions",
        url: "/commissions",
        icon: <Brush className="w-4 h-4" />,
      },
    ],
    categories: [
      { name: "Islamic Art", count: 45 },
      { name: "Contemporary", count: 32 },
      { name: "Abstract", count: 28 },
      { name: "Portraits", count: 23 },
      { name: "Landscapes", count: 19 },
      { name: "Digital Art", count: 15 },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white pt-16 pb-8 px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('footer.jpeg')] bg-cover bg-center" />
      </div>

      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-cyan-500" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Main Content Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-10 mb-16"
        >
          {/* Artist Profile Section */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-6 h-6 text-amber-400" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-cyan-300 bg-clip-text text-transparent">
                  {artist.name}
                </h2>
              </div>
              <p className="text-xl text-amber-200 font-semibold">
                {artist.title}
              </p>
              <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-cyan-500 rounded-full"></div>
            </div>

            <p className="text-gray-300 leading-relaxed text-lg max-w-2xl">
              {artist.bio}
            </p>
          </motion.div>

          {/* Social Media Section */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
                  <FaInstagram className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-white">Social Media</h3>
              </div>

              <div className="space-y-3">
                {artist.socialLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className={`flex items-center gap-4 px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 ${link.color} hover:text-white transition-all duration-300 group`}
                  >
                    <span className="text-2xl text-gray-300 group-hover:text-white transition-colors">
                      {link.icon}
                    </span>
                    <div>
                      <span className="font-semibold">{link.name}</span>
                      <div className="text-xs text-gray-400 group-hover:text-gray-300 mt-1">
                        Follow for updates
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-amber-600 to-amber-400 rounded-lg">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-white">Contact Info</h3>
              </div>

              <div className="space-y-4">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${artist.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-green-500/50 hover:bg-green-900/20 transition-all duration-300 group"
                >
                  <div className="">
                    <FaWhatsapp className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <div className="font-semibold">WhatsApp</div>
                    <div className="text-sm text-gray-400 group-hover:text-green-300">
                      {artist.contact.whatsapp}
                    </div>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href={`tel:${artist.contact.phone}`}
                  className="flex items-center gap-4 px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-blue-500/50 hover:bg-blue-900/20 transition-all duration-300 group"
                >
                  <div className="">
                    <Phone className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold">Phone</div>
                    <div className="text-sm text-gray-400 group-hover:text-blue-300">
                      {artist.contact.phone}
                    </div>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${artist.contact.email}`}
                  className="flex items-center gap-4 px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-red-500/50 hover:bg-red-900/20 transition-all duration-300 group"
                >
                  <div className="">
                    <FaEnvelope className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-sm text-gray-400 group-hover:text-red-300">
                      {artist.contact.email}
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-amber-500 animate-pulse" />
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Hamidreza Khajehmohammadi. All
                rights reserved.
              </p>
            </div>

            <p className="text-gray-500 text-sm">
              This website showcases four decades of artistic journey and
              creativity
            </p>

            <div className="text-gray-500 text-sm text-center md:text-right">
              <p>Designed for art lovers worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
