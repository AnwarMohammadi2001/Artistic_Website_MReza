import React, { useState, useContext } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import { AuthContext } from "../context/AuthContext";
import DashboardTopBar from "./dashboard/DashboardTopBar";

const DashboardPage = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const { user } = useContext(AuthContext);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100">
      <Sidebar
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
      />
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <DashboardTopBar />
        <main className="flex-1 overflow-y-auto dark:bg-gray-700 ">
          <MainContent activeComponent={activeComponent} />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
