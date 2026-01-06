import React, { useState } from "react";

const Biography = () => {
  const [activeTab, setActiveTab] = useState("early-life");

  const tabs = [
    { id: "early-life", label: "آغاز زندگی و تحصیلات" },
    { id: "artistic-journey", label: "سفر هنری" },
    { id: "exhibitions", label: "نمایشگاه‌ها" },
    { id: "theater", label: "تئاتر و نمایش" },
    { id: "achievements", label: "دستاوردها" },
    { id: "current", label: "فعالیت‌های کنونی" },
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
    {
      year: "۱۴۰۰",
      location: "گالری طراحان آزاد، تهران",
      title: "چهل سال خلاقیت",
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
    <div id="biography" className="bg-gradient-to-b from-gray-50 to-white">
      {/* هدر بخش بیوگرافی */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-white z-0"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            {/* تصویر هنرمند */}
            <div className="lg:w-2/5 mb-10 lg:mb-0">
              <div className="relative">
                <div className="w-64 h-80 md:w-80  mx-auto ">
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src="bio.jpg"
                      alt=""
                      className="h-[450px] w-auto rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* متن معرفی */}
            <div className="lg:w-3/5 lg:pr-12 rtl:lg:pr-0 rtl:lg:pl-12">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-amber-600 rounded-full text-sm font-semibold">
                  بیوگرافی هنرمند
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold  text-gray-700 mb-6 leading-tight">
                حمیدرضا خواجه محمدی
                <span className="block text-2xl md:text-3xl text-amber-600 mt-3">
                  پیشگام هنر معاصر ایران
                </span>
              </h1>

              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                حمیدرضا خواجه محمدی هنرمند چندرسانه‌ای ایرانی است که بیش از چهار
                دهه در عرصه‌های نقاشی، گرافیک، طراحی، تئاتر و هنرهای تجسمی
                فعالیت داشته است. آثار او تلفیقی هنرمندانه از سنت‌های هنر ایرانی
                و نوآوری‌های معاصر است که در نمایشگاه‌های داخلی و بین‌المللی
                متعددی به نمایش درآمده‌اند.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 mt-4 gap-4 mb-8">
                <div className="bg-white p-2 rounded-md shadow-md text-center">
                  <div className="text-3xl font-bold text-amber-600">۴۰+</div>
                  <div className="text-gray-600 text-sm font-semibold mt-1">
                    سال تجربه
                  </div>
                </div>
                <div className="bg-white p-4 rounded-md shadow-md text-center">
                  <div className="text-3xl font-bold text-amber-600">۵۰+</div>
                  <div className="text-gray-600 font-semibold text-sm mt-1">
                    نمایشگاه
                  </div>
                </div>
                <div className="bg-white p-4 rounded-md shadow-md text-center">
                  <div className="text-3xl font-bold text-amber-600">۱۰۰+</div>
                  <div className="text-gray-600 font-semibold text-sm mt-1">
                    اثر هنری
                  </div>
                </div>
                <div className="bg-white p-4 rounded-md shadow-md text-center">
                  <div className="text-3xl font-bold text-amber-600">۱۵</div>
                  <div className="text-gray-600 font-semibold text-sm mt-1">
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
                  className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "text-amber-700 border-b-2 border-amber-500 bg-amber-50"
                      : "text-gray-600 hover:text-amber-600 hover:bg-amber-50/50"
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
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
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
                        <span className="w-2 h-2 bg-amber-500 rounded-full ml-3"></span>
                        <span>
                          کارشناسی هنرهای تجسمی - دانشگاه تهران (۱۳۶۸)
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-amber-500 rounded-full ml-3"></span>
                        <span>
                          کارشناسی ارشد هنرهای نمایشی - دانشگاه هنر (۱۳۷۲)
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-amber-500 rounded-full ml-3"></span>
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
                  {/* تایم‌لاین */}
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exhibitions.map((exhibition, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-white to-amber-50 rounded-md shadow-md overflow-hidden border border-amber-100"
                    >
                      <div className="">
                        <div>
                          <img src={exhibition.img} alt="" />
                        </div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="px-3 py-1 bg-amber-100 flex items-center ga text-amber-800 rounded-full text-sm font-semibold">
                            <span>سال</span>
                            <span> {exhibition.year}</span>
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-800 mb-2">
                          {exhibition.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {exhibition.location}
                        </p>
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

            {activeTab === "achievements" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  دستاوردها و جوایز
                </h3>
                <div className="space-y-4">
                  {awards.map((award, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gradient-to-r from-white to-amber-50 p-5 rounded-xl shadow-sm border-r-4 border-amber-500"
                    >
                      <div className="flex-shrink-0 w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center ml-4">
                        <span className="text-2xl">🏆</span>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-gray-800">
                          {award.title}
                        </h4>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-amber-600 font-semibold">
                            {award.year}
                          </span>
                          <span className="text-gray-600 text-sm">
                            {award.organization}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "current" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  فعالیت‌های کنونی
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl h-full">
                      <h4 className="font-bold text-gray-800 mb-4 text-lg">
                        آموزش و مشاوره
                      </h4>
                      <p className="text-gray-700 mb-4">
                        در حال حاضر، خواجه محمدی بخشی از وقت خود را به آموزش
                        هنرجویان جوان اختصاص داده و در دانشگاه‌های هنری به تدریس
                        اشتغال دارد.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full ml-3"></span>
                          <span>استاد مدعو دانشگاه هنر تهران</span>
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full ml-3"></span>
                          <span>مشاور هنری موزه هنرهای معاصر</span>
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full ml-3"></span>
                          <span>کارگاه‌های آموزشی طراحی پیشرفته</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl h-full">
                      <h4 className="font-bold text-gray-800 mb-4 text-lg">
                        پروژه‌های جاری
                      </h4>
                      <p className="text-gray-700 mb-4">
                        در حال کار بر روی چندین پروژه هنری بین‌رشته‌ای که تلفیقی
                        از هنر دیجیتال، نقاشی سنتی و هنر مفهومی است.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-purple-500 rounded-full ml-3 animate-pulse"></div>
                          <span>مجموعه «حافظه شهر» - هنر شهری</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-purple-500 rounded-full ml-3 animate-pulse"></div>
                          <span>نمایشگاه بین‌المللی «ایران معاصر»</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-purple-500 rounded-full ml-3 animate-pulse"></div>
                          <span>کتاب «چهار دهه نقاشی خط»</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* بخش فلسفه هنری */}
        <div className=" bg-gray-100  overflow-hidden shadow-sm mb-12">
          <div className="p-8 md:p-12">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-amber-500/30 rounded-full flex items-center justify-center ml-4">
                <span className="text-2xl">💭</span>
              </div>
              <h3 className="text-2xl font-bold">فلسفه هنری</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="leading-relaxed mb-4">
                  «هنر برای من گفتگویی بی‌پایان بین سنت و مدرنیته است. در هر
                  قطعه‌ای که خلق می‌کنم، می‌کوشم ریشه‌های کهن هنر ایرانی را با
                  زبان معاصر درآمیزم و پیامی فراتر از زمان ارائه دهم.»
                </p>
                <p className="leading-relaxed">
                  آثار خواجه محمدی اغلب حول محور مفاهیم هویت، حافظه جمعی و
                  گفتگوی فرهنگی می‌چرخند. او معتقد است هنر باید پلی بین نسل‌ها و
                  فرهنگ‌ها باشد.
                </p>
              </div>
              <div className="bg-white/10 px-6 rounded-xl">
                {/* <h4 className="font-bold mb-3">تکنیک‌ها </h4> */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="border bg-white py-4 px-6 rounded-md">
                    <span className="px-3 py-1 font-semibold text-gray-700 bg-white/20 rounded-full">
                      نقاشی خط مدرن
                    </span>
                  </div>
                  <div className="border bg-white py-4 px-6 rounded-md">
                    <span className="px-3 py-1 font-semibold text-gray-700 bg-white/20 rounded-full">
                      نقاشی خط مدرن
                    </span>
                  </div>
                  <div className="border bg-white py-4 px-6 rounded-md">
                    <span className="px-3 py-1 font-semibold text-gray-700 bg-white/20 rounded-full">
                      چیدمان مفهومی
                    </span>
                  </div>
                  <div className="border bg-white py-4 px-6 rounded-md">
                    <span className="px-3 py-1 font-semibold text-gray-700 bg-white/20 rounded-full">
                      هنر دیجیتال
                    </span>
                  </div>
                  <div className="border bg-white py-4 px-6 rounded-md">
                    <span className="px-3 py-1 font-semibold text-gray-700 bg-white/20 rounded-full">
                      مینیاتور معاصر
                    </span>
                  </div>
                  <div className="border bg-white py-4 px-6 rounded-md">
                    <span className="px-3 py-1 font-semibold text-gray-700 bg-white/20 rounded-full">
                      طراحی صحنه
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* گالری تصاویر */}
        <div className="mb-16 max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            گالری آثار
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
              <div key={item} className=" transition-shadow duration-300">
                <img
                  className={`h-full flex items-center w-[300px] justify-center `}
                  src={item}
                />
              </div>
            ))}
          </div>
        </div>

        {/* نقل قول پایانی */}
        <div className="text-center py-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-6xl text-amber-400 mb-6">"</div>
            <p className="text-2xl text-gray-800 italic leading-relaxed mb-8">
              هنر تنها زیبایی نیست، زبانی است برای گفتن ناگفتنی‌ها، دری است به
              جهان‌هایی که هنوز کشف نشده‌اند.
            </p>
            <div className="text-gray-600 font-medium">
              — حمیدرضا خواجه محمدی
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Biography;
