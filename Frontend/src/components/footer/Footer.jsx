import React from "react";
import {
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaInstagram,
  FaTelegram,
  FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const person = {
    name: "حمیدرضا خواجه محمدی",
    title: "هنرمند پیشگام هنر معاصر ایران",
    bio: "هنرمند چندرسانه‌ای با بیش از چهار دهه فعالیت در عرصه‌های نقاشی، گرافیک، طراحی، تئاتر و هنرهای تجسمی. تلفیق‌گر سنت‌های هنر ایرانی و نوآوری‌های معاصر.",
    contact: {
      whatsapp: "+989123456789",
      phone: "+982188888888",
      email: "info@khajemohammadi.ir",
    },
    links: [
      {
        name: "اینستاگرام",
        url: "https://instagram.com/khajemohammadi.art",
        icon: <FaInstagram />,
      },
      {
        name: "تلگرام",
        url: "https://t.me/khajemohammadi_channel",
        icon: <FaTelegram />,
      },
      {
        name: "یوتیوب",
        url: "https://youtube.com/@khajemohammadi_art",
        icon: <FaYoutube />,
      },
    ],
    quickLinks: [
      { name: "نمایشگاه‌ها", url: "exhibitions" },
      { name: "آثار هنری", url: "gallery" },
      { name: "بیوگرافی", url: "biography" },
      { name: "مصاحبه", url: "interview" },
      { name: "  تئاتر", url: "theater" },
      { name: "تماس با ما", url: "contact" },
    ],
  };

  return (
    <footer className="bg-gradient-to-t from-gray-900 to-gray-800 text-white py-10 px-4 ">
      <div className="max-w-7xl mx-auto">
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Name and Bio */}
          <div className="space-y-5 md:col-span-2">
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold text-amber-100">
                {person.name}
              </h2>
              <p className="text-lg text-amber-300 font-semibold">
                {person.title}
              </p>
            </div>
            <p className="text-gray-300 leading-relaxed text-justify">
              {person.bio}
            </p>
            <div className="pt-4 border-t border-gray-700">
              <h4 className="font-semibold text-amber-100 mb-3">
                لینک‌های سریع
              </h4>
              <div className="flex flex-wrap gap-3">
                {person.quickLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.url}
                    className="px-4 py-2 bg-gray-800 hover:bg-amber-600 transition-colors duration-300 rounded-full text-sm"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold border-r-4 border-amber-500 pr-3">
              شبکه‌های اجتماعی
            </h3>
            <div className="space-y-4">
              {person.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-x-3 space-x-reverse hover:bg-gray-800 p-3 rounded-lg transition-all duration-300 hover:pr-5"
                >
                  <span className="text-xl text-amber-300">{link.icon}</span>
                  <span className="text-gray-300 hover:text-white">
                    {link.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold border-r-4 border-amber-500 pr-3">
              ارتباط با هنرمند
            </h3>
            <div className="space-y-4">
              <a
                href={`https://wa.me/${person.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-x-3 space-x-reverse text-gray-300 hover:text-white hover:bg-gray-800 p-3 rounded-lg transition-all duration-300 hover:pr-5"
              >
                <FaWhatsapp className="text-2xl text-green-400" />
                <div>
                  <div dir="ltr" className="text-sm">
                    {person.contact.whatsapp}
                  </div>
                </div>
              </a>

              <a
                href={`tel:${person.contact.phone}`}
                className="flex items-center gap-x-3 space-x-reverse text-gray-300 hover:text-white hover:bg-gray-800 p-3 rounded-lg transition-all duration-300 hover:pr-5"
              >
                <FaPhone className="text-2xl text-blue-400" />
                <div>
                  <div>{person.contact.phone}</div>
                </div>
              </a>

              <a
                href={`mailto:${person.contact.email}`}
                className="flex items-center gap-x-3 space-x-reverse text-gray-300 hover:text-white hover:bg-gray-800 p-3 rounded-lg transition-all duration-300 hover:pr-5"
              >
                <FaEnvelope className="text-2xl text-red-400" />
                <div>
                  <div className="text-sm">{person.contact.email}</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-4">
          <div className="flex flex-col md:flex-row justify-center items-center text-center md:text-right">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">
                © {new Date().getFullYear()} | تمامی حقوق برای حمیدرضا خواجه
                محمدی محفوظ است.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
