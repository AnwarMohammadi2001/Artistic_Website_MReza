import React, { useState } from "react";
import { Award, Medal, ScrollText, Calendar, Star, X } from "lucide-react";

const AchievementsPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);

  /* =========================
     Categories
  ========================= */
  const categories = [
    { id: "all", label: "همه" },
    { id: "award", label: "جوایز" },
    { id: "certificate", label: "تقدیرنامه‌ها" },
    { id: "exhibition", label: "نمایشگاه‌ها" },
  ];

  /* =========================
     Achievements Data
  ========================= */
  const achievements = [
    {
      id: 1,
      title: "نشان طلای طراحی گرافیک",
      category: "award",
      year: "۱۴۰۲",
      organizer: "جشنواره ملی هنرهای تجسمی",
      description: "کسب نشان طلای طراحی گرافیک برای مجموعه پوسترهای فرهنگی",
      icon: Award,
      image: "ach/1.JPG",
    },
    {
      id: 2,
      title: "تقدیرنامه ویژه هنرمند برتر",
      category: "certificate",
      year: "۱۴۰۱",
      organizer: "وزارت فرهنگ و ارشاد اسلامی",
      description: "تقدیر به پاس چهار دهه فعالیت مستمر در حوزه هنرهای تجسمی",
      icon: ScrollText,
      image: "ach/2.JPG",
    },
    {
      id: 3,
      title: "نمایشگاه بین‌المللی هنر معاصر",
      category: "exhibition",
      year: "۱۴۰۰",
      organizer: "گالری هنر معاصر استانبول",
      description: "حضور در نمایشگاه گروهی هنرمندان معاصر خاورمیانه",
      icon: Medal,
      image: "ach/3.JPG",
    },
    {
      id: 4,
      title: "جایزه نوآوری در طراحی",
      category: "award",
      year: "۱۳۹۹",
      organizer: "انجمن طراحان گرافیک ایران",
      description: "کسب جایزه نوآوری برای ترکیب تایپوگرافی سنتی و مدرن",
      icon: Star,
      image: "ach/4.JPG",
    },
    {
      id: 4,
      title: "جایزه نوآوری در طراحی",
      category: "award",
      year: "۱۳۹۹",
      organizer: "انجمن طراحان گرافیک ایران",
      description: "کسب جایزه نوآوری برای ترکیب تایپوگرافی سنتی و مدرن",
      icon: Star,
      image: "ach/5.JPG",
    },
    {
      id: 4,
      title: "جایزه نوآوری در طراحی",
      category: "award",
      year: "۱۳۹۹",
      organizer: "انجمن طراحان گرافیک ایران",
      description: "کسب جایزه نوآوری برای ترکیب تایپوگرافی سنتی و مدرن",
      icon: Star,
      image: "ach/6.JPG",
    },
    {
      id: 4,
      title: "جایزه نوآوری در طراحی",
      category: "award",
      year: "۱۳۹۹",
      organizer: "انجمن طراحان گرافیک ایران",
      description: "کسب جایزه نوآوری برای ترکیب تایپوگرافی سنتی و مدرن",
      icon: Star,
      image: "ach/7.JPG",
    },
    {
      id: 4,
      title: "جایزه نوآوری در طراحی",
      category: "award",
      year: "۱۳۹۹",
      organizer: "انجمن طراحان گرافیک ایران",
      description: "کسب جایزه نوآوری برای ترکیب تایپوگرافی سنتی و مدرن",
      icon: Star,
      image: "ach/6.JPG",
    },
  ];

  const filteredItems =
    activeCategory === "all"
      ? achievements
      : achievements.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ================= HERO ================= */}
      <div className="relative overflow-hidden pb-6">
        {" "}
        <div className="absolute inset-0 bg-[url('/cover.JPG')] bg-cover bg-center z-0" />{" "}
        <div className="absolute inset-0 bg-black/70 z-10" />{" "}
        <div className="container mx-auto px-4 py-24 relative z-20">
          {" "}
          <div className="text-center text-white max-w-4xl mx-auto">
            {" "}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {" "}
              دستاوردها و افتخارات{" "}
            </h1>{" "}
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              {" "}
              مروری بر جوایز، تقدیرنامه‌ها و حضورهای بین‌المللی{" "}
              <span className="font-semibold text-white">
                {" "}
                حمیدرضا خواجه محمدی{" "}
              </span>{" "}
            </p>{" "}
            <div className="mt-10 flex flex-wrap justify-center gap-6">
              {" "}
              <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl">
                {" "}
                <div className="text-3xl font-bold">۳۰+</div>{" "}
                <div className="text-sm opacity-90">جایزه و تقدیر</div>{" "}
              </div>{" "}
              <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl">
                {" "}
                <div className="text-3xl font-bold">۲۰+</div>{" "}
                <div className="text-sm opacity-90">نمایشگاه بین‌المللی</div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* Wave */}{" "}
        <div className="absolute bottom-0 left-0 right-0 z-30">
          {" "}
          <svg
            className="w-full h-[120px]"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            {" "}
            <path d="M0,0V120H1200V0C800,80 400,80 0,0Z" fill="white" />{" "}
          </svg>{" "}
        </div>{" "}
      </div>

      {/* ================= INTRO ================= */}
      <div className="container mx-auto px-4 py-12 text-center max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          افتخاراتی در مسیر هنر
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          این دستاوردها حاصل سال‌ها تلاش، خلاقیت و حضور فعال در عرصه‌های ملی و
          بین‌المللی هنرهای تجسمی است.
        </p>
      </div>

      {/* ================= CATEGORIES ================= */}
      <div className="container mx-auto px-4 pb-6">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`px-6 py-3 font-bold transition-all
                ${
                  activeCategory === cat.id
                    ? "text-cyan-600 border-b-2 border-cyan-600"
                    : "text-gray-600 hover:text-cyan-600"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ================= CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-white rounded-md shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-100"
              >
                {/* Image */}
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {item.year}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-4">
                    {item.description}
                  </p>

                  <div className="text-sm text-gray-500 font-medium">
                    {item.organizer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* ================= MODAL ================= */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-white max-w-3xl w-full flex  h-[500px] rounded-lg overflow-hidden relative">
              {/* Close */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 left-4 text-gray-600  hover:text-red-500"
              >
                <X />
              </button>

              {/* Image */}
              <div className="h-full ">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedItem.title}
                </h2>

                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {selectedItem.year} – {selectedItem.organizer}
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🏆</div>
            <p className="text-gray-500 text-xl">
              موردی برای این دسته‌بندی ثبت نشده است.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementsPage;
