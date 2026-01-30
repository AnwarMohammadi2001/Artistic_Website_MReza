import React from "react";
// ایمپورت صفحات
import Dashboard from "../pages/Dashboard"; // صفحه اصلی داشبورد
import CategoryManager from "../pages/dashboard/CategoryManager"; // صفحه دسته‌بندی
import AddProject from "../pages/dashboard/AddProject"; // صفحه افزودن پروژه
import Projects from "../pages/dashboard/Projects"; // صفحه لیست پروژه‌ها (اگر دارید)
import Logout from "../pages/dashboard/Logout";

const MainContent = ({ activeComponent }) => {
  switch (activeComponent) {
    case "categories":
      return <CategoryManager />;

    case "add-project":
      return <AddProject />;

    case "projects":
      return <Projects />;

    case "logout":
      return <Logout />;

    default:
      // نکته مهم: اینجا نباید DashboardPage را برگردانید چون باعث حلقه می‌شود
      return <CategoryManager />;
  }
};

export default MainContent;
