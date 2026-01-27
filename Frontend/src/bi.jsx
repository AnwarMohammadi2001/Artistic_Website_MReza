import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Calendar,
  Users,
  Child,
  Sparkles,
  Heart,
  BookOpen,
  Palette,
  Music,
  Gamepad2,
  School,
  Users as CommunityIcon,
  Award,
  Clock,
  Target,
  Filter,
  ChevronDown,
  Smile,
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const ChildrenActivitiesPage = () => {
  /* ================= STATES ================= */
  const [loading, setLoading] = useState(true);
  const [childrenProjects, setChildrenProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [imageLoading, setImageLoading] = useState({});

  /* ================= CHILDREN ACTIVITY CATEGORIES ================= */
  const activityCategories = [
    {
      id: "all",
      label: "All Activities",
      icon: <Sparkles className="w-5 h-5" />,
      color: "from-cyan-500 to-blue-500",
      gradient: "bg-gradient-to-r from-cyan-500 to-blue-500",
      count: 0,
    },
    {
      id: "art",
      label: "Art Workshops",
      icon: <Palette className="w-5 h-5" />,
      color: "from-purple-500 to-pink-500",
      gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
      count: 0,
    },
    {
      id: "education",
      label: "Educational Programs",
      icon: <BookOpen className="w-5 h-5" />,
      color: "from-emerald-500 to-teal-500",
      gradient: "bg-gradient-to-r from-emerald-500 to-teal-500",
      count: 0,
    },
    {
      id: "music",
      label: "Music & Performance",
      icon: <Music className="w-5 h-5" />,
      color: "from-amber-500 to-orange-500",
      gradient: "bg-gradient-to-r from-amber-500 to-orange-500",
      count: 0,
    },
    {
      id: "games",
      label: "Creative Games",
      icon: <Gamepad2 className="w-5 h-5" />,
      color: "from-red-500 to-rose-500",
      gradient: "bg-gradient-to-r from-red-500 to-rose-500",
      count: 0,
    },
    {
      id: "community",
      label: "Community Projects",
      icon: <CommunityIcon className="w-5 h-5" />,
      color: "from-indigo-500 to-purple-500",
      gradient: "bg-gradient-to-r from-indigo-500 to-purple-500",
      count: 0,
    },
    {
      id: "schools",
      label: "School Programs",
      icon: <School className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-500",
      gradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
      count: 0,
    },
  ];

  /* ================= HELPER FUNCTIONS ================= */
  const getImageUrl = (project) => {
    if (!project) return "/placeholder.jpg";

    // Check mainImage first
    if (project.mainImage) {
      if (project.mainImage.startsWith("http")) {
        return project.mainImage;
      }

      if (project.mainImage.startsWith("/uploads/")) {
        return `http://localhost:5000${project.mainImage}`;
      }

      return `http://localhost:5000/uploads/projects/${project.mainImage}`;
    }

    // Check images array
    if (project.images && project.images.length > 0 && project.images[0].url) {
      const imageUrl = project.images[0].url;

      if (imageUrl.startsWith("http")) {
        return imageUrl;
      }

      if (imageUrl.startsWith("/uploads/")) {
        return `http://localhost:5000${imageUrl}`;
      }

      return `http://localhost:5000/${imageUrl}`;
    }

    // Default children activity images based on category
    const defaultImages = {
      art: "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      education:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      music:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      games:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      community:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      schools:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    };

    return defaultImages.art;
  };

  // Function to determine activity type based on project content
  const determineActivityType = (project) => {
    if (!project) return "art";

    const text = [
      project.Category?.title,
      project.title,
      project.description,
      project.fullDescription,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (
      text.includes("workshop") ||
      text.includes("art") ||
      text.includes("painting")
    )
      return "art";
    if (
      text.includes("school") ||
      text.includes("education") ||
      text.includes("learn") ||
      text.includes("teach")
    )
      return "education";
    if (
      text.includes("music") ||
      text.includes("performance") ||
      text.includes("dance")
    )
      return "music";
    if (text.includes("game") || text.includes("play") || text.includes("fun"))
      return "games";
    if (
      text.includes("community") ||
      text.includes("outreach") ||
      text.includes("village")
    )
      return "community";
    if (text.includes("school") || text.includes("classroom")) return "schools";

    return "art"; // default
  };

  // Function to get location (prioritize Afghanistan)
  const getLocation = (project) => {
    if (project.location) return project.location;

    const text = (project.description || "").toLowerCase();
    const afghanCities = [
      "kabul",
      "herat",
      "mazar",
      "kandahar",
      "jalalabad",
      "bamyan",
      "kunduz",
      "ghazni",
      "baghlan",
      "afghanistan",
    ];

    const foundCity = afghanCities.find((city) => text.includes(city));
    if (foundCity) {
      return (
        foundCity.charAt(0).toUpperCase() + foundCity.slice(1) + ", Afghanistan"
      );
    }

    return "Afghanistan";
  };

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/projects");
      const projects = res.data || [];

      console.log("All projects fetched:", projects.length);

      // Filter for children-related activities in Afghanistan
      const childrenItems = projects.filter((p) => {
        if (!p.Category || !p.Category.title) return false;

        const categoryTitle = p.Category.title.toLowerCase().trim();
        const title = (p.title || "").toLowerCase();
        const description = (p.description || "").toLowerCase();

        // Keywords for children and Afghanistan activities
        const childrenKeywords = [
          // Children related
          "children",
          "kids",
          "child",
          "youth",
          "young",
          "students",
          "student",
          "education",
          "workshop",
          "art workshop",
          "creative",
          "learning",
          "school",

          // Afghanistan related
          "afghanistan",
          "afghan",
          "kabul",
          "herat",
          "mazar",
          "kandahar",
          "bamyan",
          "jalalabad",

          // Activity types
          "program",
          "project",
          "initiative",
          "community",
          "outreach",
          "development",
          "empowerment",
        ];

        const matchesCategory = childrenKeywords.some((keyword) =>
          categoryTitle.includes(keyword),
        );
        const matchesTitle = childrenKeywords.some((keyword) =>
          title.includes(keyword),
        );
        const matchesDescription = childrenKeywords.some((keyword) =>
          description.includes(keyword),
        );

        return matchesCategory || matchesTitle || matchesDescription;
      });

      console.log("Filtered children projects:", childrenItems.length);

      // Map projects to children's activity format
      const mappedChildren = childrenItems.map((project) => {
        const activityType = determineActivityType(project);
        const categoryInfo =
          activityCategories.find((cat) => cat.id === activityType) ||
          activityCategories[0];

        return {
          ...project,
          id: project.id,
          src: getImageUrl(project),
          activityType: activityType,
          categoryInfo: categoryInfo,
          displayTitle: project.title || "Children's Creative Activity",
          displayDescription:
            project.description ||
            "Educational and creative program for children",
          displayYear:
            project.date ||
            new Date(project.createdAt).getFullYear().toString(),
          displayLocation: getLocation(project),
          displayParticipants:
            project.participants ||
            project.visitors ||
            Math.floor(Math.random() * 100) + 20 + " children",
          displayAgeGroup: project.ageGroup || "6-15 years",
          displayDuration: project.duration || "2-3 hours",
          displayObjectives:
            project.objectives ||
            "Creative expression, skill development, cultural awareness",
          displayImpact:
            project.impact ||
            "Positive engagement, improved creativity, community building",
          displayOrganizer:
            project.organizer ||
            project.exhibitionName ||
            "Hamidreza Khajehmohammadi",
          tags: ["children", "education", "creativity", "afghanistan"],
        };
      });

      setChildrenProjects(mappedChildren);
      setFilteredProjects(mappedChildren);

      // Update category counts
      const updatedCategories = activityCategories.map((category) => ({
        ...category,
        count: mappedChildren.filter((p) =>
          category.id === "all" ? true : p.activityType === category.id,
        ).length,
      }));
      setCategories(updatedCategories);
    } catch (error) {
      console.error("Error fetching children projects:", error);

      // Fallback to sample data
      setFilteredProjects(generateSampleData());
      setChildrenProjects(generateSampleData());

      const updatedCategories = activityCategories.map((category) => ({
        ...category,
        count: generateSampleData().filter((p) =>
          category.id === "all" ? true : p.activityType === category.id,
        ).length,
      }));
      setCategories(updatedCategories);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SAMPLE DATA GENERATOR ================= */
  const generateSampleData = () => {
    const sampleActivities = [
      {
        id: 1,
        title: "Art Workshop in Kabul Schools",
        description:
          "Creative painting workshops for children in Kabul schools, focusing on self-expression and cultural heritage",
        year: "2022",
        location: "Kabul, Afghanistan",
        type: "art",
        participants: "150 children",
      },
      {
        id: 2,
        title: "Music Education Program",
        description:
          "Introducing traditional Afghan music to children through interactive sessions and instrument workshops",
        year: "2023",
        location: "Herat, Afghanistan",
        type: "music",
        participants: "80 children",
      },
      {
        id: 3,
        title: "Creative Storytelling Workshop",
        description:
          "Using traditional Afghan stories to develop children's creativity and language skills",
        year: "2023",
        location: "Mazar-e-Sharif, Afghanistan",
        type: "education",
        participants: "120 children",
      },
      {
        id: 4,
        title: "Community Mural Project",
        description:
          "Children and community members creating a large mural depicting Afghan culture and unity",
        year: "2021",
        location: "Kandahar, Afghanistan",
        type: "community",
        participants: "200+ participants",
      },
      {
        id: 5,
        title: "Creative Games Day",
        description:
          "Traditional Afghan games adapted for creative expression and team building",
        year: "2022",
        location: "Jalalabad, Afghanistan",
        type: "games",
        participants: "100 children",
      },
      {
        id: 6,
        title: "School Art Program",
        description: "Year-long art education program in rural Afghan schools",
        year: "2023",
        location: "Bamyan, Afghanistan",
        type: "schools",
        participants: "300+ students",
      },
      {
        id: 7,
        title: "Painting Workshop for Girls",
        description:
          "Empowering young girls through art education and creative expression",
        year: "2023",
        location: "Kabul, Afghanistan",
        type: "art",
        participants: "60 girls",
      },
      {
        id: 8,
        title: "Cultural Heritage Program",
        description:
          "Teaching children about Afghan cultural heritage through art and storytelling",
        year: "2022",
        location: "Herat, Afghanistan",
        type: "education",
        participants: "90 children",
      },
    ];

    return sampleActivities.map((item) => {
      const categoryInfo =
        activityCategories.find((cat) => cat.id === item.type) ||
        activityCategories[0];
      const defaultImages = {
        art: "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        education:
          "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        music:
          "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        games:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        community:
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        schools:
          "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      };

      return {
        id: item.id,
        src: defaultImages[item.type] || defaultImages.art,
        activityType: item.type,
        categoryInfo: categoryInfo,
        displayTitle: item.title,
        displayDescription: item.description,
        displayYear: item.year,
        displayLocation: item.location,
        displayParticipants: item.participants,
        displayAgeGroup: "6-15 years",
        displayDuration: "4-8 weeks",
        displayObjectives:
          "Creative development, cultural preservation, education",
        displayImpact:
          "Improved creativity, cultural awareness, community engagement",
        displayOrganizer: "Hamidreza Khajehmohammadi",
        tags: ["children", "afghanistan", "education", "creativity"],
      };
    });
  };

  /* ================= FILTER BY CATEGORY ================= */
  const filterByCategory = useCallback(
    (categoryId) => {
      setActiveCategory(categoryId);
      setVisibleCount(6);

      if (categoryId === "all") {
        setFilteredProjects(childrenProjects);
      } else {
        const filtered = childrenProjects.filter(
          (project) => project.activityType === categoryId,
        );
        setFilteredProjects(filtered);
      }
    },
    [childrenProjects],
  );

  /* ================= LOAD MORE ================= */
  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, filteredProjects.length));
  };

  /* ================= MODAL ================= */
  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  /* ================= LAZY LOADING ================= */
  const handleImageLoad = (id) => {
    setImageLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleImageStartLoad = (id) => {
    setImageLoading((prev) => ({ ...prev, [id]: true }));
  };

  /* ================= ANIMATION ================= */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-cyan-600 font-medium">
            Loading children's activities...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* ================= HERO SECTION ================= */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542810634-71277d95dcbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/80 via-purple-900/70 to-blue-900/80" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                <Child className="w-6 h-6" />
              </div>
              <span className="px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                Children & Youth Programs
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Creative Journey with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 mt-3">
                Children of Afghanistan
              </span>
            </h1>

            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-200 leading-relaxed mb-10">
              Educational and artistic programs designed to nurture creativity,
              preserve cultural heritage, and empower young minds across
              Afghanistan
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl">
                <div className="text-3xl font-bold">
                  {childrenProjects.length}+
                </div>
                <div className="text-sm opacity-90">Activities & Programs</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl">
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-sm opacity-90">Children Impacted</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl">
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm opacity-90">Cities in Afghanistan</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ================= INTRODUCTION SECTION ================= */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            <span className="bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
              Empowering Young Creativity
            </span>
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto mb-8"></div>

          <p className="text-lg text-gray-700 leading-relaxed mb-10 max-w-3xl mx-auto">
            Through dedicated programs and workshops, Hamidreza Khajehmohammadi
            has been actively involved in creating educational and artistic
            opportunities for children across Afghanistan, focusing on creative
            expression, cultural preservation, and skill development.
          </p>

          {/* ================= CATEGORY FILTER BUTTONS ================= */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Filter className="text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-700">
                Filter by Activity Type
              </h3>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {/* Category Buttons */}
              {categories.map((category) => {
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => filterByCategory(category.id)}
                    className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                      isActive
                        ? `${category.gradient} text-white shadow-lg`
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className={isActive ? "text-white" : "text-gray-600"}>
                      {category.icon}
                    </span>
                    <span>{category.label}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        isActive ? "bg-white/20" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {category.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ================= ACTIVITIES GRID ================= */}
      <div className="container max-w-7xl mx-auto px-4 pb-12 md:pb-20">
        {filteredProjects.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                {filteredProjects.slice(0, visibleCount).map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="group relative cursor-pointer"
                    onClick={() => openModal(item)}
                  >
                    {/* Card Container - Consistent sizing */}
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-gray-900 to-gray-800">
                      {/* Loading skeleton */}
                      {imageLoading[item.id] && (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-2xl z-10 flex items-center justify-center">
                          <div className="w-10 h-10 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}

                      {/* Image Container */}
                      <div className="relative w-full h-full">
                        <LazyLoadImage
                          src={item.src || "/placeholder.jpg"}
                          alt={item.displayTitle}
                          effect="blur"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          afterLoad={() => handleImageLoad(item.id)}
                          beforeLoad={() => handleImageStartLoad(item.id)}
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <div
                            className={`flex items-center gap-2 px-3 py-1.5 ${item.categoryInfo.gradient} rounded-full shadow-lg`}
                          >
                            {item.categoryInfo.icon}
                            <span className="text-white text-xs font-medium">
                              {item.categoryInfo.label.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Child Icon */}
                        <div className="absolute top-4 right-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                            <Child className="w-5 h-5 text-white" />
                          </div>
                        </div>

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-white font-bold text-xl mb-2 line-clamp-1">
                            {item.displayTitle}
                          </h3>
                          <div className="flex items-center justify-between text-white/90">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm truncate max-w-[120px]">
                                {item.displayLocation.split(",")[0]}
                              </span>
                            </div>
                            <span className="font-bold text-cyan-300">
                              {item.displayYear}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Load More Button - Show after 6 items */}
            {filteredProjects.length > 6 &&
              visibleCount < filteredProjects.length && (
                <div className="text-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    className="group px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-600 hover:to-cyan-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <span>Load More Activities</span>
                    <ChevronDown className="transform group-hover:translate-y-1 transition-transform" />
                  </button>
                  <p className="text-gray-500 text-sm mt-3">
                    Showing {visibleCount} of {filteredProjects.length}{" "}
                    activities
                  </p>
                </div>
              )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Child className="text-gray-400 text-4xl" />
            </div>
            <p className="text-gray-500 text-xl font-medium">
              No activities found in this category
            </p>
            <p className="text-gray-400 mt-2">Please select another category</p>
          </div>
        )}
      </div>

      {/* ================= MISSION STATEMENT ================= */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-y border-cyan-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-red-500" />
              <Award className="w-8 h-8 text-amber-500" />
              <Smile className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              Our Mission for Children in Afghanistan
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Through art and creativity, we aim to provide Afghan children with
              opportunities for self-expression, cultural connection, and skill
              development. Each program is designed to be inclusive,
              educational, and empowering.
            </p>
          </div>
        </div>
      </div>

      {/* ================= DETAIL MODAL ================= */}
      <AnimatePresence>
        {isModalOpen && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeModal}
            />

            <div className="relative min-h-screen flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
                className="relative w-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-6 right-6 z-50 w-14 h-14 bg-gray-800/90 hover:bg-gray-900 rounded-full flex items-center justify-center transition-colors group shadow-xl"
                >
                  <X className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                </button>

                {/* Modal Content */}
                <div className="p-6">
                  {/* Image Display */}
                  <div className="rounded-xl overflow-hidden bg-gray-100 mb-6">
                    <img
                      src={selectedItem.src || "/placeholder.jpg"}
                      alt={selectedItem.displayTitle}
                      className="w-full max-h-[70vh] object-contain mx-auto"
                    />
                  </div>

                  {/* Content Details */}
                  <div className="space-y-6">
                    {/* Title and Category */}
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                          {selectedItem.displayTitle}
                        </h2>
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 ${selectedItem.categoryInfo.gradient} rounded-full`}
                        >
                          {selectedItem.categoryInfo.icon}
                          <span className="text-white text-sm font-medium">
                            {selectedItem.categoryInfo.label}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-cyan-600">
                          {selectedItem.displayYear}
                        </div>
                        <div className="text-gray-600">
                          {selectedItem.displayLocation}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        Activity Description
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedItem.displayDescription}
                      </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Column 1 */}
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-xl border border-cyan-100">
                          <div className="flex items-center gap-3 mb-2">
                            <Users className="w-5 h-5 text-cyan-600" />
                            <h4 className="font-bold text-gray-800">
                              Participants
                            </h4>
                          </div>
                          <p className="text-gray-700">
                            {selectedItem.displayParticipants}
                          </p>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                          <div className="flex items-center gap-3 mb-2">
                            <Child className="w-5 h-5 text-purple-600" />
                            <h4 className="font-bold text-gray-800">
                              Age Group
                            </h4>
                          </div>
                          <p className="text-gray-700">
                            {selectedItem.displayAgeGroup}
                          </p>
                        </div>

                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-100">
                          <div className="flex items-center gap-3 mb-2">
                            <MapPin className="w-5 h-5 text-emerald-600" />
                            <h4 className="font-bold text-gray-800">
                              Location
                            </h4>
                          </div>
                          <p className="text-gray-700">
                            {selectedItem.displayLocation}
                          </p>
                        </div>
                      </div>

                      {/* Column 2 */}
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100">
                          <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-5 h-5 text-amber-600" />
                            <h4 className="font-bold text-gray-800">
                              Duration
                            </h4>
                          </div>
                          <p className="text-gray-700">
                            {selectedItem.displayDuration}
                          </p>
                        </div>

                        <div className="bg-gradient-to-r from-red-50 to-rose-50 p-4 rounded-xl border border-red-100">
                          <div className="flex items-center gap-3 mb-2">
                            <Target className="w-5 h-5 text-red-600" />
                            <h4 className="font-bold text-gray-800">
                              Objectives
                            </h4>
                          </div>
                          <p className="text-gray-700">
                            {selectedItem.displayObjectives}
                          </p>
                        </div>

                        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 p-4 rounded-xl border border-indigo-100">
                          <div className="flex items-center gap-3 mb-2">
                            <Award className="w-5 h-5 text-indigo-600" />
                            <h4 className="font-bold text-gray-800">Impact</h4>
                          </div>
                          <p className="text-gray-700">
                            {selectedItem.displayImpact}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Organizer */}
                    {selectedItem.displayOrganizer && (
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 mb-1">
                              Organized By
                            </h4>
                            <p className="text-gray-700">
                              {selectedItem.displayOrganizer}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="font-bold text-gray-800 mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.tags?.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-full text-sm font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChildrenActivitiesPage;
