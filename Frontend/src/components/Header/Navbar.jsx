import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { PiSignIn } from "react-icons/pi";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation(); // برای تشخیص مسیر فعلی

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // تشخیص اسکرول برای تغییر استایل navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);

      // شناسایی بخش فعال
      const sections = [
        "home",
        "biography",
        "painting",
        "graphic",
        "interview",
        "design",
        "exhibition",
        "theater",
        "miscellaneous",
        "contact",
      ];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // منو آیتم‌ها با رنگ‌های مختلف برای حالت فعال
  const menuItems = [
    {
      id: "biography",
      name: "بیوگرافی",
      path: "/",
    },
    {
      id: "painting",
      name: "نقاشی",
      path: "/painting",
    },
    {
      id: "graphic",
      name: "گرافیک",
      path: "/graphic",
    },
    {
      id: "interview",
      name: "مصاحبه",
      path: "/interview",
    },
    {
      id: "design",
      name: "طراحی",
      path: "/design",
    },
    {
      id: "exhibition",
      name: "نمایشگاه",
      path: "/exhibition",
    },
    {
      id: "theater",
      name: "تئاتر",
      path: "/theater",
    },
    {
      id: "achivment",
      name: "دست آورد ها",
      path: "/achivment",
    },
    {
      id: "miscellaneous",
      name: "متفرقه",
      path: "/miscellaneous",
    },
    {
      id: "contact",
      name: "تماس با ما",
      path: "/contact",
    },
  ];

  // تابع برای تشخیص اینکه آیا مسیر فعلی با آیتم منو مطابقت دارد
  const isActivePath = (path) => {
    // اگر در صفحه اصلی هستیم و path هم "/" است
    if (location.pathname === "/" && path === "/") return true;

    // برای صفحات دیگر، بررسی می‌کنیم که مسیر با path آیتم شروع شود
    return location.pathname.startsWith(path) && path !== "/";
  };

  return (
    <>
      {/* Navbar اصلی */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all py-2.5  bg-cyan-700 duration-300 ${
          scrolled ? "" : ""
        }`}
      >
        <div className="max-w-7xl  py-3 mx-auto px-4">
          <div className="flex items-center justify-center">
            {/* منوی دسکتاپ */}

            <div className="hidden lg:flex items-center justify-center gap-x-8">
              {menuItems.map((item) => {
                const isActive =
                  activeSection === item.id || isActivePath(item.path);

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`relative font-medium group transition-colors duration-300
          ${isActive ? "text-gray-300" : "text-gray-100 hover:text-gray-300"}
        `}
                  >
                    {item.name}

                    {/* underline */}
                    <span
                      className={`absolute right-0 -bottom-1 h-[2px] w-full bg-gray-300
            transform transition-transform duration-300 origin-right
            ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
          `}
                    />
                  </Link>
                );
              })}
            </div>
            <div className="flex items-center gap-x-4 justify-between ">
              {/* دکمه منو موبایل */}
              <button
                onClick={toggleMenu}
                className="lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md"
                aria-label="منو"
              >
                <span
                  className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                    isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                ></span>
                <span
                  className={`block w-6 h-0.5 bg-white my-1.5 transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                ></span>
              </button>
              <p className="md:hidden">حمید رضا خواجه محمدی</p>
            </div>
          </div>
        </div>
      </nav>

      {/* منوی موبایل */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-white to-blue-50 shadow-2xl z-50 transform transition-transform duration-500 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* هدر منو موبایل */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-gray-800">منو</h2>
              <p className="text-sm text-gray-500 mt-1">حمید رضا خواجه محمدی</p>
            </div>
            <button
              onClick={closeMenu}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600 transition-colors"
              aria-label="بستن منو"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>

          {/* لیست منو در موبایل */}
          <div className="flex-1 overflow-y-auto p-6">
            <ul className="space-y-3">
              {menuItems.map((item, index) => {
                const isActive =
                  activeSection === item.id || isActivePath(item.path);

                return (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className={`flex items-center p-4 rounded-xl transition-all
                        ${
                          isActive
                            ? ` ${"text-amber-600"} shadow-md border-r-4}`
                            : " hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                        }`}
                      onClick={closeMenu}
                    >
                      <span className="font-medium text-lg">{item.name}</span>
                      {isActive && (
                        <span className="mr-auto w-2 h-2 rounded-full animate-pulse"></span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* اطلاعات تماس */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <h4 className="font-semibold text-gray-700 mb-2">اطلاعات تماس</h4>
              <p className="text-sm text-gray-600">
                ایمیل: info@khajemohammadi.art
              </p>
              <p className="text-sm text-gray-600">تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</p>
            </div>
          </div>

          {/* فوتر منو موبایل */}
          <div className="p-6 border-t border-gray-200">
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} کلیه حقوق محفوظ است
            </p>
          </div>
        </div>
      </div>

      {/* overlay برای بستن منو */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMenu}
        ></div>
      )}

      {/* اسپیسر برای جلوگیری از پوشیده شدن محتوا */}
      <div className="h-[69px]"></div>
    </>
  );
};

export default Navbar;
