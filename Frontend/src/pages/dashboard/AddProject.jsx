import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegEdit, FaPlus, FaExternalLinkAlt } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { BsLink, BsImage } from "react-icons/bs";
import { IoEyeOutline, IoClose } from "react-icons/io5";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AddProject = () => {
  const { token } = useContext(AuthContext);

  const [form, setForm] = useState({
    title: "",
    liveUrl: "",
    image: null,
  });
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/projects`);
      setProjects(res.data);
    } catch (err) {
      toast.error("Failed to fetch projects!");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setForm({ ...form, image: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!form.title || (!form.image && !editingId)) {
      toast.error("Title and image are required");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("liveUrl", form.liveUrl);
    if (form.image) formData.append("image", form.image);

    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/api/projects/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Project updated successfully!");
        setEditingId(null);
      } else {
        await axios.post(`${BASE_URL}/api/projects`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Project added successfully!");
      }

      setForm({ title: "", liveUrl: "", image: null });
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error occurred!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#1f2937",
      color: "#f9fafb",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Project deleted successfully!");
        fetchProjects();
      } catch (err) {
        toast.error(err.response?.data?.message || "Error occurred!");
      }
    }
  };

  const handleEdit = (project) => {
    setForm({
      title: project.title,
      liveUrl: project.liveUrl,
      image: null,
    });
    setEditingId(project._id || project.id);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setForm({ title: "", liveUrl: "", image: null });
    setEditingId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <div className="">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Projects Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and showcase your portfolio projects
            </p>
          </div>

          {/* Add Project Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 mt-4 sm:mt-0"
          >
            <FaPlus className="text-lg" />
            Add New Project
          </button>
        </div>

        {/* Form Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl border border-gray-200 dark:border-gray-700">
              {/* Close Button */}
              <button
                onClick={resetForm}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <IoClose className="text-2xl" />
              </button>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {editingId ? "Edit Project" : "Add New Project"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Title *
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter project title"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                {/* URL Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Link
                  </label>
                  <input
                    name="liveUrl"
                    value={form.liveUrl}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* File Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Image {!editingId && "*"}
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <BsImage className="w-8 h-8 mb-3 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, GIF (MAX. 10MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  </div>
                  {form.image && (
                    <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                      Selected: {form.image.name}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {editingId ? "Updating..." : "Adding..."}
                    </>
                  ) : editingId ? (
                    "Update Project"
                  ) : (
                    "Add Project"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Projects ({projects.length})
            </h3>
          </div>

          {/* Projects Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    #
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Link
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Preview
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {projects.map((project, i) => (
                  <tr
                    key={project._id || project.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                  >
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                        {i + 1}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {project.title}
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {project.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                        >
                          <BsLink className="text-lg" />
                          <span className="text-sm">Visit</span>
                        </a>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-sm">
                          No link
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {project.image && (
                        <div className="flex items-center gap-3">
                          <img
                            src={`${BASE_URL}${project.image}`}
                            alt={project.title}
                            className="h-12 w-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm"
                          />
                          <button
                            onClick={() =>
                              window.open(
                                `${BASE_URL}${project.image}`,
                                "_blank"
                              )
                            }
                            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                            title="View full image"
                          >
                            <IoEyeOutline className="text-lg" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleEdit(project)}
                          className="p-2 text-green-600 hover:text-green-800 dark:hover:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Edit project"
                        >
                          <FaRegEdit className="text-lg" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() =>
                            handleDelete(project._id || project.id)
                          }
                          className="p-2 text-red-600 hover:text-red-800 dark:hover:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Delete project"
                        >
                          <MdOutlineDelete className="text-lg" />
                        </button>

                        {/* Live Preview Button */}
                        {project.liveUrl && (
                          <button
                            onClick={() =>
                              window.open(project.liveUrl, "_blank")
                            }
                            className="p-2 text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-all duration-200 hover:scale-110"
                            title="View live project"
                          >
                            <FaExternalLinkAlt className="text-lg" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {projects.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-12 px-6 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <BsImage className="w-16 h-16 mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">
                          No projects yet
                        </p>
                        <p className="text-sm">
                          Get started by adding your first project!
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProject;
