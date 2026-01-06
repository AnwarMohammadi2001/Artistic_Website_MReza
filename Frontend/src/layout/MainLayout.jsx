// MainLayout.jsx
import Footer from '../components/footer/Footer';
import Navbar from '../components/Header/Navbar'
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="">
      <Navbar />
      <main className="">
        <Outlet /> {/* Nested route renders here */}
      </main>
      <Footer />
    </div>
  );
}
