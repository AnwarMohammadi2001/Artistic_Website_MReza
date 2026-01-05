import React, { useEffect, useState } from "react";
const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loading time

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="w-full min-h-screen relative transition-colors duration-500 overflow-x-hidden">
      {isLoading ? (
        // 👇 show this while loading
        <div className="flex justify-center items-center min-h-screen bg-white"></div>
      ) : (
        // 👇 main content after loading finishes
        <>
        this is home page
        </>
      )}
    </div>
  );
};

export default Home;
