import React from "react";
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

const MainContent = ({ activeComponent }) => {
  switch (activeComponent) {
    case "dashboard":
      return <Dashboard />;
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
    case "logout":
      return <Logout />;
      
    default:
      // نکته مهم: اینجا نباید DashboardPage را برگردانید چون باعث حلقه می‌شود
      return <Dashboard />;
  }
};

export default MainContent;