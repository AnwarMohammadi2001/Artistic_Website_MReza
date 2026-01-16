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
} from "lucide-react";

import Bill from "./Bill";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      setIsSubmitted(true);

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setTimeout(() => setIsSubmitted(false), 3000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Phone />,
      title: "تلفن",
      details: ["021-12345678"],
    },
    {
      icon: <Mail />,
      title: "ایمیل",
      details: ["support@example.com"],
    },
    {
      icon: <MessageSquare />,
      title: "واتساپ",
      details: ["0912-345-6789"],
    },
  ];

  const socialMedia = [
    { icon: <Instagram />, url: "#" },
    { icon: <Facebook />, url: "#" },
    { icon: <Twitter />, url: "#" },
    { icon: <Youtube />, url: "#" },
    { icon: <Linkedin />, url: "#" },
  ];

  return (
    <div className=" bg-gray-50  flex flex-col items-center py-8" dir="rtl">
      {/* <Bill /> */}

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 border">
          {/* Contact Info */}
          <div className="bg-gray-100   p-8">
            <h2 className="text-2xl font-bold mb-8 border-b pb-4">
              اطلاعات تماس
            </h2>

            <div className="space-y-6">
              {contactInfo.map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="p-3 bg-red-50 text-amber-600 rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    {item.details.map((d, idx) => (
                      <p key={idx} className="text-gray-600 text-sm">
                        {d}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="mt-10 pt-6 border-t flex justify-between items-center">
              <span className="font-semibold">شبکه‌های اجتماعی</span>
              <div className="flex gap-3">
                {socialMedia.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 hover:text-amber-600 transition"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
          {/* Contact Form */}
          <div className="bg-white p-8">
            <h2 className="text-2xl font-bold mb-8 border-b pb-4">
              فرم تماس با ما
            </h2>
            {isSubmitted ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2">پیام شما ارسال شد</h3>
                <p className="text-gray-500">به زودی با شما تماس می‌گیریم</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col gap-4">
                  <input
                    name="name"
                    placeholder="نام *"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="py-2.5 px-3 bg-gray-200 rounded-md focus:outline-none focus:ring-1 ring-amber-500"
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="ایمیل *"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="py-2.5 px-3 bg-gray-200 rounded-md focus:outline-none focus:ring-1 ring-amber-500"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <input
                    name="phone"
                    placeholder="شماره تماس"
                    value={formData.phone}
                    onChange={handleChange}
                    className="py-2.5 px-3 bg-gray-200 rounded-md focus:outline-none focus:ring-1 ring-amber-500"
                  />
                  <input
                    name="subject"
                    placeholder="موضوع *"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="py-2.5 px-3 bg-gray-200 rounded-md focus:outline-none focus:ring-1 ring-amber-500"
                  />
                </div>

                <div className="">
                  <textarea
                    name="message"
                    rows="4"
                    placeholder="پیام شما *"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="py-2.5 px-3 w-full bg-gray-200 rounded-md focus:outline-none focus:ring-1 ring-amber-500"
                  />
                </div>

                <button
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-amber-600 hover:bg-amber-700 text-white"
                  }`}
                >
                  {isSubmitting ? "در حال ارسال..." : "ارسال پیام"}
                  {!isSubmitting && <SendHorizonal className="w-5 h-5" />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
