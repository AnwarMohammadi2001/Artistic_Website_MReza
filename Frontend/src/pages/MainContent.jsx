import React from "react";
<<<<<<< HEAD
import Dashboard from "../pages/Dashboard";

import Logout from "../pages/dashboard/Logout";
import DashboardPage from "./DashboardPage";

import Painting from "./dashboard/Painting";
import Geraphic from "./dashboard/Geraphic";
import Design from "./dashboard/Design";
import Exhibition from "./dashboard/Exhibition";
import Theater from "./dashboard/Theater";
import Miscellaneous from "./dashboard/Miscellaneous";
import Interview from "./dashboard/Interview";
=======
// ایمپورت صفحات
import Dashboard from "../pages/Dashboard"; // صفحه اصلی داشبورد
import CategoryManager from "../pages/dashboard/CategoryManager"; // صفحه دسته‌بندی
import AddProject from "../pages/dashboard/AddProject"; // صفحه افزودن پروژه
import Projects from "../pages/dashboard/Projects"; // صفحه لیست پروژه‌ها (اگر دارید)
import Logout from "../pages/dashboard/Logout";
>>>>>>> Anwar

const MainContent = ({ activeComponent }) => {
  switch (activeComponent) {
    case "dashboard":
      return <Dashboard />;
<<<<<<< HEAD
    case "painting":
      return <Painting />;
    case "graphic":
      return <Geraphic />;
    case "interview":
      return <Interview />;
    case "design":
      return <Design />;
    case "exhibition":
      return <Exhibition />;
    case "theater":
      return <Theater />;
    case "miscellaneous":
      return <Miscellaneous />;
=======

    case "categories":
      return <CategoryManager />;

    case "add-project":
      return <AddProject />;

    case "projects":
      return <Projects />;

>>>>>>> Anwar
    case "logout":
      return <Logout />;

    default:
      // نکته مهم: اینجا نباید DashboardPage را برگردانید چون باعث حلقه می‌شود
      return <Dashboard />;
  }
};

export default MainContent;
