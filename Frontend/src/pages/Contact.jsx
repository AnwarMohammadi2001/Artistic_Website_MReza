import React, { useState } from "react";
import {
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  SendHorizonal,
  User,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
    const [loading, setLoading] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeField, setActiveField] = useState(null);

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
       setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
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

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      details: ["+98 21 1234 5678", ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: ["hamid.painter.ir@gmail.com"],
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Studio Address",
      details: ["No. 123, Art Street", ],
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Working Hours",
      details: ["Saturday - Wednesday: 9 AM - 6 PM", "Thursday: 9 AM - 2 PM"],
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const socialMedia = [
    {
      icon: <Instagram className="w-5 h-5" />,
      url: "#",
      name: "Instagram",
      color: "hover:bg-gradient-to-br from-purple-600 to-pink-600",
    },
    {
      icon: <Facebook className="w-5 h-5" />,
      url: "#",
      name: "Facebook",
      color: "hover:bg-gradient-to-br from-blue-600 to-blue-800",
    },
    {
      icon: <Twitter className="w-5 h-5" />,
      url: "#",
      name: "Twitter",
      color: "hover:bg-gradient-to-br from-cyan-500 to-blue-500",
    },
    {
      icon: <Youtube className="w-5 h-5" />,
      url: "#",
      name: "YouTube",
      color: "hover:bg-gradient-to-br from-red-600 to-red-800",
    },
   
  ];

  const inputFields = [
    { name: "name", label: "Full Name", icon: <User className="w-5 h-5" /> },
    {
      name: "email",
      label: "Email Address",
      icon: <Mail className="w-5 h-5" />,
    },
    {
      name: "phone",
      label: "Phone Number",
      icon: <Phone className="w-5 h-5" />,
    },
    {
      name: "subject",
      label: "Subject",
      icon: <MessageSquare className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-white/60" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container max-w-7xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-medium text-amber-600 bg-amber-50 px-4 py-1.5 rounded-full">
              Get In Touch
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
            Contact{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-cyan-600">
              Hamidreza
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Connect with the artist for commissions, exhibitions,
            collaborations, or simply to discuss art
          </p>
        </motion.div>

        {/* Split Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Artist Portrait & Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            {/* Portrait Container */}
            <div className="relative rounded-lg h-[600px] overflow-hidden  shadow-2xl">
              {/* Artist Portrait */}
              <div className=" relative">
                <img
                  src="bio.jpg"
                  alt="Hamidreza Khajehmohammadi"
                  className="w-full object-contain"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Artist Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h2 className="text-3xl font-bold mb-2">
                    Hamidreza Khajehmohammadi
                  </h2>
                  <p className="text-gray-200 text-lg mb-4">
                    Visual Artist & Painter
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                    <p className="text-gray-300">Available for commissions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {contactInfo.slice(0, 2).map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className={`bg-gradient-to-br bg-gray-50 rounded-xl p-5 text-gray-700 shadow-lg`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                  </div>
                  {item.details.map((detail, idx) => (
                    <p
                      key={idx}
                      className="text-gray-600 text-sm leading-relaxed"
                    >
                      {detail}
                    </p>
                  ))}
                </motion.div>
              ))}
            </div>

            {/* Quote */}
          </motion.div>

          {/* Right Side - Contact Form & Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="space-y-8"
          >
            {/* Contact Form Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-1 bg-gradient-to-r from-amber-500 via-amber-400 to-cyan-500" />
              <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-r from-amber-500 to-amber-400 rounded-xl">
                    <SendHorizonal className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Send a Message
                    </h2>
                    <p className="text-gray-600">
                      Fill out the form below and I'll get back to you soon
                    </p>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center py-12"
                    >
                      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-emerald-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Thank you for reaching out. I'll review your message and
                        get back to you within 24-48 hours.
                      </p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                      >
                        Send Another Message
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        {inputFields.map((field, index) => (
                          <motion.div
                            key={field.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 * index }}
                            className="relative"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className="text-gray-500">{field.icon}</div>
                              <label className="text-sm font-medium text-gray-700">
                                {field.label} *
                              </label>
                            </div>
                            <input
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleChange}
                              onFocus={() => setActiveField(field.name)}
                              onBlur={() => setActiveField(null)}
                              required={field.name !== "phone"}
                              className={`w-full py-2.5 px-4 bg-gray-100 rounded-md border-2 transition-all duration-300 ${
                                activeField === field.name
                                  ? "border-amber-400 bg-white shadow-sm"
                                  : "border-transparent hover:border-gray-200"
                              } focus:outline-none focus:border-amber-400 focus:bg-white focus:shadow-lg`}
                              placeholder={`Enter your ${field.label.toLowerCase()}`}
                            />
                          </motion.div>
                        ))}
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                        className="relative"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-5 h-5 text-gray-500" />
                          <label className="text-sm font-medium text-gray-700">
                            Your Message *
                          </label>
                        </div>
                        <textarea
                          name="message"
                          rows="2"
                          value={formData.message}
                          onChange={handleChange}
                          onFocus={() => setActiveField("message")}
                          onBlur={() => setActiveField(null)}
                          required
                          className={`w-full py-3.5 px-4 bg-gray-200 rounded-xl border-2 transition-all duration-300 ${
                            activeField === "message"
                              ? "border-amber-400 bg-gray-200 shadow-sm"
                              : "border-transparent hover:border-gray-200"
                          } focus:outline-none focus:border-amber-400 focus:bg-white focus:shadow-lg`}
                          placeholder="Share your thoughts, questions, or project details..."
                        />
                      </motion.div>

                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                          isSubmitting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Sending Message...
                          </>
                        ) : (
                          <>
                            Send Message
                            <SendHorizonal className="w-5 h-5" />
                          </>
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Additional Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Connect on Social Media
              </h3>
              <div className="flex flex-wrap gap-3">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className={`group flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 ${social.color} hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                  >
                    {social.icon}
                    <span className="text-sm font-medium text-gray-700 group-hover:text-white">
                      {social.name}
                    </span>
                  </a>
                ))}
              </div>
              <p className="text-gray-500 text-sm mt-4">
                Follow for daily updates, behind-the-scenes content, and art
                insights
              </p>
            </motion.div>

            {/* Social Media */}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-cyan-50 px-6 py-3 rounded-full">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-gray-700 font-medium">
              Response time: Typically within 24-48 hours
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
