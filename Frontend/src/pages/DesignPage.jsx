import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Users, X, Clock, Star } from "lucide-react";

const DesignPage = () => {
  const [selectedExhibition, setSelectedExhibition] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 768) setColumns(1);
      else if (window.innerWidth < 1200) setColumns(2);
      else setColumns(3);
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // داده‌های نمایشگاه‌ها
  const exhibitions = [
    {
      id: 1,
      title: "چهل سال خلاقیت",
      image: "ex/1.JPG",
      year: "۱۴۰۰",
      date: "۱۴۰۰/۰۶/۱۵ تا ۱۴۰۰/۰۷/۱۵",
      location: "موزه هنرهای معاصر تهران",
      organizer: "انجمن هنرمندان ایران",
      description: "نمایشگاه مروری بر چهار دهه فعالیت هنری حمیدرضا خواجه محمدی",
      fullDescription:
        "این نمایشگاه که به مناسبت چهل‌سالگی فعالیت هنری برگزار شد، شامل بیش از ۵۰ اثر از دوره‌های مختلف کاری هنرمند بود. آثار شامل نقاشی، طراحی، گرافیک و تلفیق مواد مختلف می‌شد.",
      duration: "۳۰ روز",
      visitors: "۲۵۰۰ نفر",
      featured: true,
    },
    {
      id: 2,
      title: "نقاشی خط معاصر",
      image: "ex/2.JPG",
      year: "۱۳۹۸",
      date: "۱۳۹۸/۰۸/۱۰ تا ۱۳۹۸/۰۹/۱۰",
      location: "گالری سیحون، تهران",
      organizer: "خانه هنرمندان",
      description: "نمایشگاه گروهی هنرمندان پیشگام نقاشی خط",
      fullDescription:
        "نمایشگاهی از آثار برجسته هنرمندان نقاشی خط ایران که تحولات این هنر در دهه‌های اخیر را به نمایش گذاشت.",
      duration: "۳۰ روز",
      visitors: "۱۸۰۰ نفر",
    },
    {
      id: 3,
      title: "هنر ایرانی در پاریس",
      image: "ex/3.jpg",
      year: "۱۳۹۶",
      date: "۱۳۹۶/۰۳/۱۵ تا ۱۳۹۶/۰۴/۱۵",
      location: "گالری کارتیه، پاریس",
      organizer: "وزارت فرهنگ فرانسه",
      description: "نمایشگاه بین‌المللی هنر معاصر ایران",
      fullDescription:
        "این نمایشگاه که با همکاری موزه لوور برگزار شد، آثار هنرمندان ایرانی را در قلب پاریس به نمایش گذاشت.",
      duration: "۳۰ روز",
      visitors: "۵۰۰۰ نفر",
    },
    {
      id: 4,
      title: "مینیاتورهای مدرن",
      image: "ex/4.JPG",
      year: "۱۳۹۹",
      date: "۱۳۹۹/۱۱/۲۰ تا ۱۳۹۹/۱۲/۲۰",
      location: "نگارخانه تهران",
      organizer: "فرهنگستان هنر",
      description: "تلفیق هنر مینیاتور با تکنیک‌های مدرن",
      fullDescription:
        "آثار این نمایشگاه نشان‌دهنده نوآوری در هنر مینیاتور با استفاده از مواد و تکنیک‌های معاصر بود.",
      duration: "۳۰ روز",
      visitors: "۲۰۰۰ نفر",
    },
    {
      id: 5,
      title: "طراحی و گرافیک",
      image: "ex/5.jpg",
      year: "۱۴۰۱",
      date: "۱۴۰۱/۰۴/۰۵ تا ۱۴۰۱/۰۵/۰۵",
      location: "موزه طراحی گرافیک",
      organizer: "انجمن طراحان ایران",
      description: "نمایشگاه آثار برجسته طراحی و گرافیک",
      fullDescription:
        "نمایشگاهی از بهترین آثار طراحی گرافیک سه دهه اخیر ایران با تمرکز بر آثار مفهومی و تجربی.",
      duration: "۳۰ روز",
      visitors: "۳۰۰۰ نفر",
    },
    {
      id: 6,
      title: "طبیعت و انتزاع",
      image: "ex/6.jpg",
      year: "۱۴۰۲",
      date: "۱۴۰۲/۰۲/۱۰ تا ۱۴۰۲/۰۳/۱۰",
      location: "گالری ویلا، اصفهان",
      organizer: "استانداری اصفهان",
      description: "آثار انتزاعی با الهام از طبیعت ایران",
      fullDescription:
        "این نمایشگاه که در شهر تاریخی اصفهان برگزار شد، تأثیر طبیعت ایران بر هنر انتزاعی را بررسی کرد.",
      duration: "۲۸ روز",
      visitors: "۲۲۰۰ نفر",
    },
    {
      id: 7,
      title: "هنر دیجیتال",
      image: "ex/7.jpg",
      year: "۱۴۰۰",
      date: "۱۴۰۰/۰۹/۰۱ تا ۱۴۰۰/۱۰/۰۱",
      location: "مرکز هنرهای دیجیتال",
      organizer: "شرکت فناوری هنر",
      description: "نمایشگاه هنر دیجیتال و تعاملی",
      fullDescription:
        "اولین نمایشگاه بزرگ هنر دیجیتال در ایران با آثار تعاملی و تکنولوژی‌های جدید.",
      duration: "۳۰ روز",
      visitors: "۳۵۰۰ نفر",
    },
    {
      id: 8,
      title: "نمایشگاه دبی",
      image: "ex/8.jpg",
      year: "۱۳۹۷",
      date: "۱۳۹۷/۱۰/۱۵ تا ۱۳۹۷/۱۱/۱۵",
      location: "مرکز تجارت جهانی دبی",
      organizer: "دولت دبی",
      description: "نمایشگاه هنر معاصر خاورمیانه",
      fullDescription:
        "نمایشگاهی بین‌المللی که هنرمندان برجسته خاورمیانه را گرد هم آورد.",
      duration: "۳۰ روز",
      visitors: "۸۰۰۰ نفر",
    },
    {
      id: 9,
      title: "نقاشی‌های بزرگ",
      image: "ex/9.JPG",
      year: "۱۳۹۵",
      date: "۱۳۹۵/۰۵/۲۰ تا ۱۳۹۵/۰۶/۲۰",
      location: "تالار وحدت تهران",
      organizer: "وزارت فرهنگ و ارشاد اسلامی",
      description: "نمایشگاه آثار بزرگ مقیاس",
      fullDescription:
        "آثار بزرگ مقیاسی که برای اولین بار در فضای عمومی به نمایش درآمدند.",
      duration: "۳۰ روز",
      visitors: "۴۰۰۰ نفر",
    },
    {
      id: 10,
      title: "جوانان و هنر",
      image: "ex/10.JPG",
      year: "۱۴۰۲",
      date: "۱۴۰۲/۰۷/۰۱ تا ۱۴۰۲/۰۸/۰۱",
      location: "دانشگاه هنر تهران",
      organizer: "دانشگاه هنر",
      description: "نمایشگاه آثار دانشجویان و هنرمندان جوان",
      fullDescription:
        "نمایشگاهی برای معرفی استعدادهای جوان هنر ایران با مربیگری هنرمندان پیشکسوت.",
      duration: "۳۰ روز",
      visitors: "۲۸۰۰ نفر",
    },
    {
      id: 11,
      title: "نمایشگاه استانبول",
      image: "ex/11.jpg",
      year: "۱۳۹۹",
      date: "۱۳۹۹/۰۱/۱۵ تا ۱۳۹۹/۰۲/۱۵",
      location: "موزه هنرهای مدرن استانبول",
      organizer: "دولت ترکیه",
      description: "نمایشگاه فرهنگی ایران و ترکیه",
      fullDescription: "نمایشگاهی مشترک برای تقویت روابط فرهنگی بین دو کشور.",
      duration: "۳۰ روز",
      visitors: "۴۵۰۰ نفر",
    },
    {
      id: 12,
      title: "آثار اولیه",
      image: "ex/1.JPG",
      year: "۱۳۹۴",
      date: "۱۳۹۴/۱۲/۰۱ تا ۱۳۹۵/۰۱/۰۱",
      location: "گالری طراحان آزاد",
      organizer: "انجمن هنرمندان تجسمی",
      description: "نمایشگاه مروری بر آثار اولیه هنرمند",
      fullDescription:
        "نمایشگاهی از اولین آثار هنرمند که مسیر تحول او را نشان می‌دهد.",
      duration: "۳۰ روز",
      visitors: "۱۵۰۰ نفر",
    },
  ];

  const openModal = (exhibition) => {
    setSelectedExhibition(exhibition);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExhibition(null);
    document.body.style.overflow = "auto";
  };

  // بستن مودال با دکمه Esc
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isModalOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* هدر صفحه */}
      <header className="bg-white">
        <div className="max-w-7xl mx-auto px-4 pt-8">
          <h1 className="text-3xl md:text-xl text-center font-bold text-gray-800 ">
            نمایشگاه‌ها
          </h1>
        </div>
      </header>

      {/* محتوای اصلی */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* شبکه نمایشگاه‌ها */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exhibitions.map((exhibition) => (
            <div
              key={exhibition.id}
              className="bg-white rounded-md shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
              onClick={() => openModal(exhibition)}
            >
              {/* تصویر */}
              <div className="relative h-60 overflow-hidden bg-gray-100">
                <img
                  src={exhibition.image}
                  alt={exhibition.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* برچسب سال */}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-lg font-bold">
                  {exhibition.year}
                </div>
              </div>

              {/* اطلاعات */}
              <div className="p-5 ">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                  {exhibition.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {exhibition.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate max-w-[120px]">
                      {exhibition.location.split("،")[0]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* مودال نمایش جزئیات */}
      {isModalOpen && selectedExhibition && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/60" onClick={closeModal} />

          {/* Modal Container */}
          <div className="relative min-h-screen flex items-center justify-center p-4">
            {/* Modal Content */}
            <div
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                      {selectedExhibition.title}
                    </h2>
                    <div className="flex items-center gap-4 text-white/90">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-5 h-5" />
                        <span>{selectedExhibition.year}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-5 h-5" />
                        <span>{selectedExhibition.location.split("،")[0]}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* تصویر */}
                  <div className="lg:w-3/5">
                    <div className="rounded-md overflow-hidden border border-gray-200">
                      <img
                        src={selectedExhibition.image}
                        alt={selectedExhibition.title}
                        className="w-full h-64 lg:h-80 object-cover"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Users className="w-5 h-5 text-purple-600" />
                          <span className="font-bold text-gray-800">
                            برگزارکننده
                          </span>
                        </div>
                        <div className="text-gray-700 pr-8">
                          {selectedExhibition.organizer}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Clock className="w-5 h-5 text-amber-600" />
                          <span className="font-bold text-gray-800">
                            مدت زمان
                          </span>
                        </div>
                        <div className="text-gray-700 pr-8">
                          {selectedExhibition.duration}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* جزئیات */}
                  <div className="lg:w-2/5">
                    {/* توضیحات */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-3">
                        درباره نمایشگاه
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedExhibition.fullDescription}
                      </p>
                    </div>

                    {/* اطلاعات کامل */}
                    <div className="space-y-4">
                      <div className="">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <span className="font-bold text-gray-800">
                              تاریخ دقیق
                            </span>
                          </div>
                          <div className="text-gray-700 pr-8">
                            {selectedExhibition.date}
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <MapPin className="w-5 h-5 text-green-600" />
                            <span className="font-bold text-gray-800">
                              مکان نمایشگاه
                            </span>
                          </div>
                          <div className="text-gray-700 pr-8">
                            {selectedExhibition.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignPage;
