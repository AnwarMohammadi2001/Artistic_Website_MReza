import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  MdDashboardCustomize,
  MdWork,
  MdLogout,
  MdCategory, // آیکون برای دسته‌ها
  MdAddBox, // آیکون برای افزودن پروژه
<<<<<<< HEAD
} from "react-icons/md";
import {
  MdBrush,
  MdPalette,
  MdQuestionAnswer,
  MdDesignServices,
  MdOutlineMuseum,
  MdTheaterComedy,
=======
>>>>>>> Anwar
} from "react-icons/md";
import { FaBars, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeComponent, setActiveComponent }) => {
  const { logout, user } = useContext(AuthContext);
  const MySwal = withReactContent(Swal);
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    MySwal.fire({
      title: "خروج از حساب؟",
      text: "آیا مطمئن هستید می‌خواهید خارج شوید؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "بله، خارج شو!",
      cancelButtonText: "لغو",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/");
      }
    });
  };

  const allMenuItems = [
    {
      name: "داشبورد",
      value: "dashboard",
      icon: <MdDashboardCustomize className="text-green-500" />,
      adminOnly: false,
    },
    {
<<<<<<< HEAD
      name: "نقاشی",
      value: "painting",
      icon: <MdBrush className="text-blue-500" />,
      adminOnly: false,
    },
    {
      name: "گرافیک",
      value: "graphic",
      icon: <MdPalette className="text-purple-500" />,
      adminOnly: false,
    },
    {
      name: "مصاحبه",
      value: "interview",
      icon: <MdQuestionAnswer className="text-pink-500" />,
      adminOnly: false,
    },
    {
      name: "طراحی",
      value: "design",
      icon: <MdDesignServices className="text-indigo-500" />,
      adminOnly: false,
    },
    {
      name: "نمایشگاه",
      value: "exhibition",
      icon: <MdOutlineMuseum className="text-amber-500" />,
      adminOnly: false,
    },
    {
      name: "تئاتر",
      value: "theater",
      icon: <MdTheaterComedy className="text-red-500" />,
      adminOnly: false,
    },
    {
      name: "متفرقه",
      value: "miscellaneous",
      icon: <MdCategory className="text-gray-500" />,
=======
      name: "مدیریت دسته‌ها",
      value: "categories",
      icon: <MdCategory className="text-orange-500" />,
      adminOnly: true, // مثلا فقط ادمین ببیند
    },
    {
      name: "افزودن پروژه",
      value: "add-project",
      icon: <MdAddBox className="text-purple-500" />,
      adminOnly: true,
    },
    {
      name: "لیست پروژه‌ها",
      value: "projects", // اگر صفحه‌ای برای لیست دارید
      icon: <MdWork className="text-blue-500" />,
>>>>>>> Anwar
      adminOnly: false,
    },
    {
      name: "خروج",
      value: "logout",
      icon: <MdLogout className="text-rose-500" />,
      adminOnly: false,
    },
  ];

  // فیلتر کردن منو بر اساس نقش کاربر
  const accessibleComponents = allMenuItems.filter((item) => {
    // اگر آیتم ادمین می‌خواهد و کاربر ادمین نیست، نشان نده
    if (item.adminOnly && user?.role !== "admin") {
      // اگر می‌خواهید همه ببینند این شرط را بردارید یا user?.role را چک کنید
      return true; // فعلا همه را true گذاشتم تا ببینید، بعدا درست کنید
    }
    return true;
  });

  return (
    <>
      {/* Sidebar Container */}
      <div
        className={`fixed lg:static top-0 left-0 h-full z-30 transition-all duration-300 ease-in-out
          dark:bg-gray-900 dark:text-gray-200 bg-white shadow-md
          ${isOpen ? "w-64" : "w-0 lg:w-20"} 
          overflow-hidden`}
      >
        {/* Header */}
        <header className="flex items-center justify-between lg:justify-start gap-3 p-5 border-b dark:border-gray-700">
          <div className="flex items-center justify-center p-2 bg-gray-100 dark:bg-gray-800 h-10 w-10 rounded-full">
            <MdDashboardCustomize className="text-blue-600 text-xl" />
          </div>
          <span
            className={`text-lg font-bold text-gray-700 dark:text-white whitespace-nowrap 
            ${isOpen ? "inline" : "hidden lg:inline"}`}
          >
<<<<<<< HEAD
            حمید رضا
=======
            پنل مدیریت
>>>>>>> Anwar
          </span>

          {/* Close button (Mobile only) */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-red-500"
          >
            <FaTimes size={18} />
          </button>
        </header>

        {/* Sidebar Links */}
        <ul className="mx-2 mt-4 space-y-2">
          {accessibleComponents.map((component, index) => (
            <li key={index} className="relative group cursor-pointer">
              <button
                onClick={() => {
                  if (component.value === "logout") {
                    handleLogout();
                  } else {
                    setActiveComponent(component.value);
                  }
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`flex items-center gap-x-3 w-full px-4 py-3 rounded-xl transition-all duration-200
                  ${
                    activeComponent === component.value
<<<<<<< HEAD
                      ? "bg-gray-200 text-blue-600 dark:bg-gray-700 dark:text-blue-400  border-blue-600"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-gray-200"
=======
                      ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400 font-bold shadow-sm"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
>>>>>>> Anwar
                  }`}
              >
                <span className="text-2xl">{component.icon}</span>
                <span
                  className={`text-sm font-medium whitespace-nowrap 
                    ${isOpen ? "inline" : "hidden lg:inline"}`}
                >
                  {component.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Toggle Button (Mobile Only) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg block lg:hidden"
        >
          <FaBars size={20} />
        </button>
      )}
    </>
  );
};

export default Sidebar;
