import { Mail, MapPin, MapPinHouse, Phone, Sparkles } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import back1 from "../../public/back/back3.jpeg";
import { motion } from "framer-motion";
import {
  fadeIn,
  container,
  contentContainer,
  contentItem,
  fadeeIn,
} from "../utils/framermotion/variants";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const contactItems = [
    {
      icon: <Phone size={32} className="text-blue-400" />,
      title: "Phone",
      info: "+93 (077) 238-7935",
      bg: "bg-blue-500/20",
      link: "tel:+930772387935",
    },
    {
      icon: <Mail size={32} className="text-green-400" />,
      title: "Email",
      info: "info@tet-soft.com",
      bg: "bg-green-500/20",
      link: "mailto:info@tet-soft.com",
    },
    {
      icon: <FaWhatsapp size={32} className="text-green-400" />,
      title: "WhatsApp",
      info: "Message us",
      bg: "bg-green-500/20",
      link: "https://wa.me/930772387935",
    },
    {
      icon: <MapPin size={32} className="text-purple-400" />,
      title: "Address",
      info: "Barchi, Kabul, Afghanistan",
      bg: "bg-purple-500/20",
      link: "https://maps.google.com/?q=Barchi,Kabul,Afghanistan",
    },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/contact`, formData, {
        headers: { "Content-Type": "application/json" },
        timeout: 10000, // 10 second timeout
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(res.data.message || "Failed to send message");
      }
    } catch (err) {
      console.error("Contact form error:", err);

      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else if (err.code === "ECONNABORTED") {
        toast.error("Request timeout. Please try again.");
      } else {
        toast.error("Failed to send message. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="contact"
      className="relative flex min-h-screen flex-col justify-center items-center px-4 xl:py-0 py-10"
      style={{
        backgroundImage: `url(${back1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 z-10 bg-black/60"></div>

      <div className="relative z-20 w-full max-w-7xl py-10 mx-auto">
        {/* Header Section */}
        <motion.div
          variants={contentContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
          className="text-center mb-16"
        >
          <motion.div
            variants={contentItem}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-100 text-gray-50 text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4" />
            Get In Touch
          </motion.div>
          <motion.h2
            variants={contentItem}
            className="text-4xl md:text-5xl font-bold text-gray-100 mb-4"
          >
            We'd love to hear from you
          </motion.h2>
          <motion.div
            variants={contentItem}
            className="w-20 h-1 bg-gray-100 mx-auto rounded-full"
          ></motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col gap-12 items-center justify-center">
          {/* Contact Form */}
          <motion.div
            variants={contentContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
            className=" w-full max-w-2xl mx-auto lg:mx-0"
          >
            <motion.form
              variants={contentItem}
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
            >
              {/* Name Input */}
              <div className="sm:col-span-1">
                <div className="flex bg-gray-100/90 ">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name*"
                    className="w-full px-4 py-2.5 text-base outline-none placeholder:text-gray-600 bg-transparent"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="sm:col-span-1">
                <div className="flex bg-gray-100/90 ">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email*"
                    className="w-full px-4 py-2.5 text-base outline-none placeholder:text-gray-600 bg-transparent"
                    required
                  />
                </div>
              </div>

              {/* Subject Input */}
              <div className="sm:col-span-2">
                <div className="flex bg-gray-100/90 ">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject*"
                    className="w-full px-4 py-2.5 text-base outline-none placeholder:text-gray-600 bg-transparent"
                    required
                  />
                </div>
              </div>

              {/* Message Input */}
              <div className="sm:col-span-2">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Message*"
                  className="w-full px-4 py-2.5 text-base outline-none min-h-[100px] max-h-[150px] resize-y bg-gray-100/90  placeholder:text-gray-600"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-2 flex justify-center mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex gap-2 border-2 border-gray-100 text-white text-lg font-bold hover:bg-gray-100 hover:text-gray-800 transition-all duration-500 px-12 py-3 cursor-pointer hover:scale-105 ${
                    loading && "opacity-70 cursor-not-allowed"
                  }`}
                >
                  {loading ? "Sending..." : "Submit"}
                </button>
              </div>
            </motion.form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.2 }}
            className=" w-full max-w-7xl mx-auto lg:mx-0"
          >
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
              {contactItems.map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.link}
                  target={item.link.startsWith("http") ? "_blank" : "_self"}
                  rel={
                    item.link.startsWith("http") ? "noopener noreferrer" : ""
                  }
                  whileHover={{ scale: 1.05 }}
                  variants={fadeeIn("up", idx * 0.3)}
                  whileInView="show"
                  initial="hidden"
                  viewport={{ once: false, amount: 0.2 }}
                  className="flex flex-col items-center text-center p-6 bg-white/10 backdrop-blur-sm hover:bg-white/20 "
                >
                  <div className={`p-3 rounded-full mb-4 ${item.bg}`}>
                    {item.icon}
                  </div>
                  <h4 className="text-gray-100 text-xl font-bold mb-3">
                    {item.title}
                  </h4>
                  <p className="text-gray-100 text-lg font-semibold">
                    {item.info}
                  </p>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
