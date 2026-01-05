import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    isAdmin: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      toast.success("User registered successfully!");
      setForm({ email: "", password: "", isAdmin: false });
      navigate("/login"); // redirect to login
    } catch (err) {
      const msg = err.response?.data?.message || "Error registering user";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 px-4">
      {/* Heading */}
      <h2 className="text-lg font-bold text-center text-gray-900 dark:text-white">
        REGISTER
      </h2>
      <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 text-center max-w-sm">
        Create your account to get started.
      </p>

      {/* Form */}
      <form
        className="w-full max-w-sm mt-6 space-y-6 "
        onSubmit={handleSubmit}
      >
        {/* Email */}
        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            placeholder=" "
            value={form.email}
            onChange={handleChange}
            className="peer w-full border-2 rounded-md px-4 py-4 dark:bg-gray-900 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-black"
            required
          />
          <label
            htmlFor="email"
            className="absolute left-4 -top-3 bg-white dark:bg-gray-900 px-2 text-gray-500 text-sm transition-all duration-300
                       peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                       peer-focus:-top-3 peer-focus:bg-white peer-focus:dark:bg-gray-900 peer-focus:px-2 peer-focus:text-sm peer-focus:text-black dark:peer-focus:text-white"
          >
            Email address*
          </label>
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder=" "
            value={form.password}
            onChange={handleChange}
            className="peer w-full border-2 rounded-md px-4 py-4 dark:bg-gray-900 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-black"
            required
          />
          <label
            htmlFor="password"
            className="absolute left-4 -top-3 bg-white dark:bg-gray-900 px-2 text-gray-500 text-sm transition-all duration-300
                       peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                       peer-focus:-top-3 peer-focus:bg-white peer-focus:dark:bg-gray-900 peer-focus:px-2 peer-focus:text-sm peer-focus:text-black dark:peer-focus:text-white"
          >
            Password*
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-5 text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Admin checkbox */}
        <label className="flex items-center mb-4 text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            name="isAdmin"
            checked={form.isAdmin}
            onChange={handleChange}
            className="mr-2"
          />
          Admin User
        </label>

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-full text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black dark:bg-gray-700 "
          } transition-all duration-300`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {/* Login Link */}
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-6">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="font-medium text-black dark:text-white hover:underline cursor-pointer"
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default Register;
