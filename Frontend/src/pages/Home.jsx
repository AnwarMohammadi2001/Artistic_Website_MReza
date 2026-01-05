import React, { useEffect, useState } from "react";
import Biography from "./Biography";
const Home = () => {
  return (
    <div className="w-full min-h-screen relative transition-colors duration-500 overflow-x-hidden">
      <Biography />
    </div>
  );
};

export default Home;
