import React from "react";
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/dashboard/Projects";
import Profile from "../pages/dashboard/Profile";
import Logout from "../pages/dashboard/Logout";
import DashboardPage from "./DashboardPage";
import AboutDashboard from "./dashboard/AboutDashboard";
import DashboardMessages from "./dashboard/DashboardMessages";
import ManageSkill from "./dashboard/ManageSkill";

const MainContent = ({ activeComponent }) => {
  switch (activeComponent) {
    case "dashboard":
      return <Dashboard />;
    case "projects":
      return <Projects />;
    case "profile":
      return <Profile />;
    case "about":
      return <AboutDashboard />;
    case "message":
      return <DashboardMessages />;
    case "skills":
      return <ManageSkill />;
    case "logout":
      return <Logout />;
    default:
      return <DashboardPage />;
  }
};

export default MainContent;
