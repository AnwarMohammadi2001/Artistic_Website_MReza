import { Link } from "react-router-dom";
import Testimonials from "../components/Testimonials";
import React, { useState } from "react";

const Biography = () => {
  const [activeTab, setActiveTab] = useState("early-life");

  const tabs = [
    { id: "early-life", label: "آغاز زندگی و تحصیلات" },
    { id: "exhibitions", label: "نمایشگاه‌ها" },
    { id: "theater", label: "تئاتر و نمایش" },
  ];

  const timelineEvents = [
    {
      year: "۱۳۴۵",
      title: "تولد",
      description: "حمیدرضا خواجه محمدی در تهران متولد شد",
    },
    {
      year: "۱۳۶۰",
      title: "آغاز فعالیت هنری",
      description: "شروع طراحی و نقاشی در نوجوانی",
    },
    {
      year: "۱۳۶۵",
      title: "ورود به دانشگاه",
      description: "تحصیل در رشته هنرهای تجسمی",
    },
    {
      year: "۱۳۷۰",
      title: "اولین نمایشگاه انفرادی",
      description: "نمایشگاه نقاشی در گالری سیحون",
    },
    {
      year: "۱۳۷۵",
      title: "تئاتر حرفه‌ای",
      description: "کارگردانی اولین نمایش تئاتر",
    },
    {
      year: "۱۳۸۰",
      title: "تاسیس استودیو",
      description: "تاسیس استودیوی شخصی طراحی و گرافیک",
    },
    {
      year: "۱۳۹۰",
      title: "نمایشگاه بین‌المللی",
      description: "شرکت در نمایشگاه هنری پاریس",
    },
    {
      year: "۱۴۰۰",
      title: "چهل‌سالگی فعالیت هنری",
      description: "برگزاری مراسم بزرگداشت",
    },
  ];

  const exhibitions = [
    {
      year: "۱۳۷۰",
      location: "گالری سیحون، تهران",
      title: "نقاشی‌های انتزاعی",
      img: "b.JPG",
    },
    {
      year: "۱۳۷۵",
      location: "موزه هنرهای معاصر، تهران",
      title: "نقاشی خط معاصر",
      img: "b.JPG",
    },
    {
      year: "۱۳۸۰",
      location: "گالری ویلا، اصفهان",
      title: "آثار ترکیبی",
      img: "b.JPG",
    },
    {
      year: "۱۳۸۵",
      location: "نگارخانه تهران",
      title: "مینیاتورهای مدرن",
      img: "b.JPG",
    },
    {
      year: "۱۳۹۰",
      location: "پاریس، فرانسه",
      title: "هنر ایرانی معاصر",
      img: "b.JPG",
    },
    {
      year: "۱۳۹۵",
      location: "دبی، امارات",
      title: "کالیگرافی مدرن",
      img: "b.JPG",
    },
  ];

  const awards = [
    {
      year: "۱۳۷۲",
      title: "جایزه بهترین نقاش جوان",
      organization: "جشنواره هنرهای تجسمی",
    },
    {
      year: "۱۳۷۸",
      title: "نشان طلای طراحی گرافیک",
      organization: "انجمن طراحان ایران",
    },
    {
      year: "۱۳۸۵",
      title: "جایزه بین‌المللی کالیگرافی",
      organization: "مسابقات هنری استانبول",
    },
    {
      year: "۱۳۹۲",
      title: "هنرمند برسال",
      organization: "خانه هنرمندان ایران",
    },
    {
      year: "۱۳۹۸",
      title: "جایزه یک عمر فعالیت هنری",
      organization: "وزارت فرهنگ و ارشاد اسلامی",
    },
  ];

  return (
    <div className="">
      {/* هدر بخش بیوگرافی */}
      <div className="relative overflow-hidden h-[600px]">
        <div className="absolute inset-0 bg-[url('/cover.JPG')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 py-20">
          <div className="flex  justify-center items-center">
            {/* متن معرفی */}
            <div className="lg:w-3/5 lg:pr-12 rtl:lg:pr-0 text-center rtl:lg:pl-12">
              <div className="mb-6">
                <span className="md:inline-block hidden px-4 py-2 bg-amber-600 rounded-full text-sm font-semibold">
                  بیوگرافی هنرمند
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold   text-gray-100 mb-6 ">
                حمیدرضا خواجه محمدی
                <span className="block text-2xl md:text-3xl pt-2 text-cyan-600 mt-3">
                  هنرمند تجسمی و آرت دایرکتور
                </span>
              </h1>

              <p className="text-lg text-gray-200 mb-6 max-w-2xl mx-auto  leading-relaxed">
                حمیدرضا خواجه محمدی هنرمند چندرسانه‌ای ایرانی است که بیش از چهار
                دهه در عرصه‌های نقاشی، گرافیک، طراحی، تئاتر و هنرهای تجسمی
                فعالیت داشته است. آثار او تلفیقی هنرمندانه از سنت‌های هنر ایرانی
                و نوآوری‌های معاصر است که در نمایشگاه‌های داخلی و بین‌المللی
                متعددی به نمایش درآمده‌اند.
              </p>

              <div className="flex items-center justify-center  mt-4 gap-6 mb-8">
                <div className=" p-2 rounded-md shadow-md text-center">
                  <div className="text-5xl font-bold text-amber-600">۴۰+</div>
                  <div className="text-gray-300 text-sm font-semibold mt-1">
                    سال تجربه
                  </div>
                </div>
                <div className=" p-4 rounded-md shadow-md text-center">
                  <div className="text-5xl font-bold text-amber-600">۵۰+</div>
                  <div className="text-gray-300 font-semibold text-sm mt-1">
                    نمایشگاه
                  </div>
                </div>
                <div className=" p-4 rounded-md shadow-md text-center">
                  <div className="text-5xl font-bold text-amber-600">۱۰۰+</div>
                  <div className="text-gray-300 font-semibold text-sm mt-1">
                    اثر هنری
                  </div>
                </div>
                <div className=" p-4 rounded-md shadow-md text-center">
                  <div className="text-5xl font-bold text-amber-600">۱۵</div>
                  <div className="text-gray-300 font-semibold text-sm mt-1">
                    جایزه
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* تب‌های بخش‌های مختلف بیوگرافی */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-md shadow-sm overflow-hidden mb-12">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-6 py-3 text-sm font-medium cursor-pointer transition-all ${
                    activeTab === tab.id
                      ? "text-cyan-700 border-b-2 border-cyan-600 bg-cyan-50"
                      : "text-gray-700 hover:text-cyan-600 hover:bg-amber-50/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* محتوای تب‌ها */}
          <div className="p-6">
            {activeTab === "early-life" && (
              <div className="space-y-6">
                <h3 className="text-3xl font-bold  text-gray-800 mb-4">
                  آغاز زندگی و تحصیلات
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      حمیدرضا خواجه محمدی در سال ۱۳۴۵ در تهران متولد شد. از
                      کودکی استعداد هنری خود را در طراحی و نقاشی نشان داد و تحت
                      تأثیر محیط فرهنگی خانواده، به هنر علاقه‌مند شد.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      تحصیلات خود را در رشته هنرهای تجسمی در دانشگاه تهران به
                      اتمام رساند و در طول دوران دانشجویی تحت تأثیر استادان
                      بزرگی چون مارکو گریگوریان و محمود فرشچیان قرار گرفت.
                    </p>
                  </div>
                  <div className=" rounded-xl">
                    <h4 className="font-bold text-gray-800 mb-3">تحصیلات</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-cyan-700 rounded-full ml-3"></span>
                        <span>
                          کارشناسی هنرهای تجسمی - دانشگاه تهران (۱۳۶۸)
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-cyan-700 rounded-full ml-3"></span>
                        <span>
                          کارشناسی ارشد هنرهای نمایشی - دانشگاه هنر (۱۳۷۲)
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-cyan-700 rounded-full ml-3"></span>
                        <span>دوره تخصصی طراحی گرافیک - ایتالیا (۱۳۷۵)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "artistic-journey" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  سفر هنری
                </h3>
                <div className="relative">
                  <div className="border-r-2 border-amber-200 absolute h-full left-1/2 transform -translate-x-1/2 hidden md:block"></div>

                  <div className="space-y-12">
                    {timelineEvents.map((event, index) => (
                      <div
                        key={index}
                        className={`flex items-center ${
                          index % 2 === 0
                            ? "md:flex-row"
                            : "md:flex-row-reverse"
                        }`}
                      >
                        <div
                          className={`w-1/2 ${
                            index % 2 === 0
                              ? "md:text-right md:pr-12"
                              : "md:text-left md:pl-12"
                          } hidden md:block`}
                        >
                          <div
                            className={`p-4 bg-white rounded-lg shadow-md ${
                              index % 2 === 0 ? "ml-auto" : "mr-auto"
                            } max-w-md`}
                          >
                            <h4 className="font-bold text-gray-800">
                              {event.title}
                            </h4>
                            <p className="text-gray-600 text-sm mt-1">
                              {event.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-full border-4 border-white shadow-md relative z-10 mx-auto md:mx-0"></div>

                        <div
                          className={`w-1/2 ${
                            index % 2 === 0
                              ? "md:text-left md:pl-12"
                              : "md:text-right md:pr-12"
                          } hidden md:block`}
                        >
                          <div className="text-2xl font-bold text-amber-600">
                            {event.year}
                          </div>
                        </div>

                        {/* نسخه موبایل */}
                        <div className="md:hidden w-full mt-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-lg font-bold text-amber-600">
                              {event.year}
                            </div>
                            <div className="font-bold text-gray-800">
                              {event.title}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm bg-white p-3 rounded-lg shadow-sm">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "exhibitions" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  نمایشگاه‌ها
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {exhibitions.map((exhibition, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-white via-amber-50 to-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-amber-100 hover:border-amber-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/0 via-transparent to-amber-300/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-0"></div>

                      {/* Image Container with Overlay */}
                      <div className="relative overflow-hidden h-64">
                        <img
                          src={exhibition.img}
                          alt={exhibition.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60"></div>

                        {/* Year Badge */}
                        <div className="absolute top-4 right-4 z-10">
                          <span className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-2 backdrop-blur-sm">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>{exhibition.year}</span>
                          </span>
                        </div>

                        {/* Location Badge */}
                        <div className="absolute bottom-4 right-4 z-10">
                          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-amber-800 text-xs font-semibold rounded-lg shadow-md flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>{exhibition.location.split("،")[0]}</span>
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 relative z-10 bg-white">
                        {/* Title with hover effect */}
                        <h4 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-amber-700 transition-colors duration-300 line-clamp-2">
                          {exhibition.title}
                        </h4>

                        {/* Description/Location */}
                        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                          {exhibition.location}
                        </p>

                        {/* View Details Button */}
                        <button className="mt-6 w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg shadow-md hover:shadow-md hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group/btn">
                          <span>مشاهده جزئیات</span>
                          <svg
                            className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Corner Decoration */}
                      <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden">
                        <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-amber-400/20 to-transparent rotate-45"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "theater" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  تئاتر و نمایش
                </h3>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <div className="bg-gradient-to-br from-purple-500 to-blue-600 text-white p-6 rounded-xl text-center">
                        <div className="text-5xl mb-4">🎭</div>
                        <h4 className="text-xl font-bold">
                          کارگردان و طراح صحنه
                        </h4>
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <p className="text-gray-700 leading-relaxed mb-4">
                        خواجه محمدی علاوه بر هنرهای تجسمی، در عرصه تئاتر نیز
                        فعالیت گسترده‌ای داشته است. وی کارگردانی بیش از ۱۵ نمایش
                        را بر عهده داشته و طراحی صحنه و لباس بسیاری از نمایش‌های
                        مطرح تئاتر ایران را انجام داده است.
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-white/70 p-4 rounded-lg">
                          <div className="font-bold text-gray-800">
                            نمایش‌های شاخص
                          </div>
                          <ul className="text-sm text-gray-600 mt-2 space-y-1">
                            <li>• هملت به روایت شرق</li>
                            <li>• دیوارهای شیشه‌ای</li>
                            <li>• رنگ‌های فراموش شده</li>
                          </ul>
                        </div>
                        <div className="bg-white/70 p-4 rounded-lg">
                          <div className="font-bold text-gray-800">
                            جوایز تئاتر
                          </div>
                          <ul className="text-sm text-gray-600 mt-2 space-y-1">
                            <li>• جایزه بهترین طراحی صحنه (۱۳۷۸)</li>
                            <li>• جایزه ویژه جشنواره تئاتر فجر</li>
                            <li>• جایزه بین‌المللی طراحی تئاتر</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* گالری تصاویر */}
        <div className="mb-16 max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-700 mb-8 text-center">
            گالری آثار من
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4">
            {[
              "bi/1.JPG",
              "bi/2.JPG",
              "bi/3.JPG",
              "bi/4.JPG",
              "bi/5.JPG",
              "bi/6.JPG",
              "bi/1.JPG",
              "bi/2.JPG",
            ].map((item) => (
              <Link
                key={item}
                className="relative transition-shadow duration-300"
              >
                <div className="absolute inset-0 bg-black/30"></div>
                <img
                  className={`h-full flex items-center w-[300px] rounded-md justify-center hover:scale-103 duration-300 transition-all hover:shadow `}
                  src={item}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Biography;
