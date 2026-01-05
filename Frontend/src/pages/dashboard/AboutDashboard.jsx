import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { FaXmark } from "react-icons/fa6";
import { toast } from "react-toastify";

const AboutDashboard = () => {
  const { token } = useContext(AuthContext);

  const [about, setAbout] = useState(null);
  const [form, setForm] = useState({
    name: "",
    story: "",
    resume: null,
    image1: null,
    image2: null,
    experienceYears: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch About info
  const fetchAbout = async () => {
    setFetching(true);
    try {
      const res = await axios.get("http://localhost:5000/api/about");
      if (Array.isArray(res.data) && res.data.length > 0) {
        setAbout(res.data[0]);
      } else if (res.data) {
        setAbout(res.data);
      } else {
        setAbout(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch About info!");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("story", form.story);
      formData.append("experienceYears", form.experienceYears);
      if (form.resume) formData.append("resume", form.resume);
      if (form.image1) formData.append("image1", form.image1);
      if (form.image2) formData.append("image2", form.image2);

      await axios.post("http://localhost:5000/api/about", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("About info updated successfully!");
      fetchAbout();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error occurred!");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setForm({
      name: about?.name || "",
      story: about?.story || "",
      resume: null,
      image1: null,
      image2: null,
      experienceYears: about?.experienceYears || 0,
    });
    setIsModalOpen(true);
  };

  if (fetching) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center text-gray-500 dark:text-gray-300">
        Loading About info...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 dark:bg-gray-900 dark:text-gray-200 min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">About Me</h1>
        <button
          onClick={handleEdit}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition w-full sm:w-auto"
        >
          {about ? "Edit About" : "Add About"}
        </button>
      </div>

      {/* Display About info */}
      {about ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow space-y-4 transition-colors duration-300">
          <p>
            <strong>Name:</strong> {about.name}
          </p>
          <p>
            <strong>Story:</strong> {about.story}
          </p>
          <p>
            <strong>Experience Years:</strong> {about.experienceYears}
          </p>
          {about.resume && (
            <p>
              <a
                href={`http://localhost:5000${about.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Download Resume
              </a>
            </p>
          )}
          <div className="flex flex-wrap gap-4">
            {about.image1 && (
              <img
                src={`http://localhost:5000${about.image1}`}
                alt="image1"
                className="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded"
              />
            )}
            {about.image2 && (
              <img
                src={`http://localhost:5000${about.image2}`}
                alt="image2"
                className="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded"
              />
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No About info found.</p>
      )}

      {/* Modal for Editing */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg p-6 relative transition-colors duration-300">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-red-500 hover:text-gray-900"
            >
              <FaXmark size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4 dark:text-gray-100">
              {about ? "Edit About" : "Add About"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                required
              />
              <textarea
                name="story"
                value={form.story}
                onChange={handleChange}
                placeholder="Your Story"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                required
              />
              <input
                type="number"
                name="experienceYears"
                value={form.experienceYears}
                onChange={handleChange}
                placeholder="Experience Years"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                min={0}
              />
              <input
                type="file"
                name="resume"
                onChange={handleFileChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
              <input
                type="file"
                name="image1"
                onChange={handleFileChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
              <input
                type="file"
                name="image2"
                onChange={handleFileChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
              <button
                type="submit"
                className={`w-full p-2 rounded text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } transition`}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save About Info"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutDashboard;
