// MainLayout.jsx
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="">
      <main className="">
        <Outlet /> {/* Nested route renders here */}
      </main>
    </div>
  );
}
