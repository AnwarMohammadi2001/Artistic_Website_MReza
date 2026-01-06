import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layout/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import DashboardPage from "./pages/DashboardPage";
import Printing from "./pages/Printing";
import GeraphicPage from "./pages/GeraphicPage";
import InterviewPage from "./pages/InterviewPage";
import ExhibitionPage from "./pages/ExhibitionPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/painting" element={<Printing />} />
            <Route path="/graphic" element={<GeraphicPage />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/exhibition" element={<ExhibitionPage />} />
          </Route>

          {/* Auth pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
