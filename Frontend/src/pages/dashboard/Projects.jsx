import React from "react";
import AddProject from "./AddProject";

const Projects = () => {
  return (
    <div className="lg:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
        Projects Management
      </h1>

      {/* Description */}
      <p className="text-center mb-6 text-gray-600 dark:text-gray-300">
        Add new projects, edit existing ones, or delete projects as needed.
      </p>

      {/* Add / Edit Project Form + Project List */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-colors duration-300">
        <AddProject />
      </div>
    </div>
  );
};

export default Projects;
