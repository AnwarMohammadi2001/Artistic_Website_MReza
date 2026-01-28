import React, { useState, useEffect } from "react";
import {
  Home,
  Search,
  ArrowLeft,
  AlertCircle,
  Compass,
  RefreshCw,
} from "lucide-react";

const PageNotFound = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentPages, setRecentPages] = useState([]);

  // Simulate recent pages from localStorage
  useEffect(() => {
    // In a real app, you'd get this from localStorage or browser history
    const mockRecentPages = [
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: "Contact Us", path: "/contact" },
      { name: "Services", path: "/services" },
    ];
    setRecentPages(mockRecentPages);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, you would redirect to search results
      alert(`Searching for: ${searchQuery}`);
      // You could implement: window.location.href = `/search?q=${searchQuery}`;
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full mx-auto text-center">
        {/* Error Code and Message */}
        <div className="mb-10">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-red-100 to-orange-100 mb-6">
            <AlertCircle className="w-20 h-20 text-red-500" />
          </div>
          <h1 className="text-8xl md:text-9xl font-bold text-gray-800 mb-4">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sorry, we couldn't find the page you're looking for. The page might
            have been moved, deleted, or perhaps you mistyped the address.
          </p>
        </div>

   

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 font-medium py-3 px-6 rounded-lg transition duration-200 shadow-sm hover:shadow"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </button>

          <button
            onClick={handleGoHome}
            className="flex items-center justify-center bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            <Home className="mr-2 h-5 w-5" />
            Go to Homepage
          </button>

          <button
            onClick={handleReload}
            className="flex items-center justify-center bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 font-medium py-3 px-6 rounded-lg transition duration-200 shadow-sm hover:shadow"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Reload Page
          </button>
        </div>

    

        {/* Footer Note */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Error code: 404 • Page not found</p>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
