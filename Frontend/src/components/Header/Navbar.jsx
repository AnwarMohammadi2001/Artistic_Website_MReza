import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { PiSignIn } from "react-icons/pi";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Detect scroll for navbar style change
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);

      // Identify active section
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

  // Menu items with different colors for active state
  const menuItems = [
    {
      id: "biography",
      name: "Biography",
      path: "/",
    },
    {
      id: "painting",
      name: "Painting",
      path: "/painting",
    },
    {
      id: "graphic",
      name: "Graphic",
      path: "/graphic",
    },
    {
      id: "interview",
      name: "Interview",
      path: "/interview",
    },
    {
      id: "exhibition",
      name: "Exhibitions & Awards",
      path: "/exhibition",
    },
    {
      id: "theater",
      name: "Children",
      path: "/children",
    },
    {
      id: "achivment",
      name: "Achievements",
      path: "/achivment",
    },
    {
      id: "miscellaneous",
      name: "Miscellaneous",
      path: "/miscellaneous",
    },
    {
      id: "contact",
      name: "Contact Us",
      path: "/contact",
    },
  ];

  // Function to check if current path matches menu item
  const isActivePath = (path) => {
    // If on homepage and path is "/"
    if (location.pathname === "/" && path === "/") return true;

    // For other pages, check if path starts with item path
    return location.pathname.startsWith(path) && path !== "/";
  };

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all py-2.5 bg-cyan-700 duration-300 ${
          scrolled ? "" : ""
        }`}
      >
        <div className="max-w-7xl py-3 mx-auto px-4">
          <div className="flex items-center justify-center">
            {/* Desktop Menu */}
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

                    {/* Underline */}
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
            <div className="flex items-center gap-x-4 justify-between">
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md"
                aria-label="Menu"
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
              <p className="md:hidden text-gray-50 font-bold text-2xl">
                Hamid Reza Khaje Mohammadi
              </p>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-white to-blue-50 shadow-2xl z-50 transform transition-transform duration-500 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-gray-800">Menu</h2>
            </div>
            <button
              onClick={closeMenu}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600 transition-colors"
              aria-label="Close menu"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>

          {/* Mobile Menu List */}
          <div className="flex-1 overflow-y-auto p-6">
            <ul className="space-y-1">
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
                            ? `${"text-amber-600"} shadow-md border-r-4}`
                            : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
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
          </div>
        </div>
      </div>

      {/* Overlay for closing menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMenu}
        ></div>
      )}

      {/* Spacer to prevent content from being covered */}
      <div className="h-[69px]"></div>
    </>
  );
};

export default Navbar;
