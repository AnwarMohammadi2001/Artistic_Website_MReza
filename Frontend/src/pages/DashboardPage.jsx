import React, { useState, useContext } from "react";
import Sidebar from "../pages/Sidebar"; // مسیر را چک کنید
import MainContent from "../pages/MainContent"; // مسیر را چک کنید
import { AuthContext } from "../context/AuthContext";
import DashboardTopBar from "../pages/dashboard/DashboardTopBar"; // مسیر را چک کنید

const DashboardPage = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const { user } = useContext(AuthContext);

  return (
    <div dir="rtl" className="flex h-screen w-full overflow-hidden bg-gray-100">
      {/* سایدبار سمت چپ */}
      <Sidebar
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
      />
      
      {/* ستون سمت راست شامل هدر و محتوا */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <DashboardTopBar />
        
        <main className="flex-1 bg-gray-200 overflow-y-auto md:p-6">
          <MainContent activeComponent={activeComponent} />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;