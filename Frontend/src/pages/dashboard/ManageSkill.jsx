import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageSkill = () => {
  const [file, setFile] = useState(null);
  const [group, setGroup] = useState("upper");
  const [logos, setLogos] = useState([]);

  const fetchLogos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/marquee");
      setLogos(res.data);
    } catch (err) {
      console.error("Failed to fetch logos:", err);
    }
  };

  useEffect(() => {
    fetchLogos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", file);
    formData.append("group", group);

    try {
      await axios.post("http://localhost:5000/api/marquee", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFile(null);
      fetchLogos();
    } catch (err) {
      console.error("Failed to add logo:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/marquee/${id}`);
      fetchLogos();
    } catch (err) {
      console.error("Failed to delete logo:", err);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-gray-200">
        ⚙️ Manage Marquee Logos
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 items-start sm:items-center"
      >
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border px-3 py-2 rounded w-full sm:w-auto dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
          required
        />
        <select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          className="border px-3 py-2 rounded dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
        >
          <option value="upper">Upper Marquee</option>
          <option value="lower">Lower Marquee</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition w-full sm:w-auto"
        >
          Add
        </button>
      </form>

      {/* Logos List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {logos.length > 0 ? (
          logos.map((logo) => (
            <div
              key={logo._id}
              className="border p-4 rounded flex flex-col items-center gap-2 dark:border-gray-700 dark:bg-gray-800 transition hover:shadow-lg"
            >
              <img
                src={`http://localhost:5000${logo.image}`}
                alt="logo"
                className="h-12 w-auto object-contain"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                {logo.group}
              </span>
              <button
                onClick={() => handleDelete(logo._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition text-sm"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-4">
            No logos added yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default ManageSkill;
