import React, { useState, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      login(res.data.user, res.data.token); // store user & token
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 px-4">
      {/* Logo */}
      {/* Heading */}
      <h2 className="text-lg font-bold text-center text-gray-900 dark:text-white">
        LOGIN
      </h2>
      <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 text-center max-w-sm">
        Enter your credentials to access your account.
      </p>

      {/* Form */}
      <form className="w-full max-w-sm mt-6 space-y-6" onSubmit={handleLogin}>
        {/* Email */}
        <div className="relative">
          <input
            type="email"
            id="email"
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        {/* Forgot Password */}
        <div className="text-right">
          <a
            href="#"
            className="text-sm text-black dark:text-white font-medium hover:underline"
          >
            Forgot password?
          </a>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-black dark:bg-gray-700 cursor-pointer hover:scale-103 text-white font-bold py-3 rounded-full transition-all duration-300"
        >
          LOG IN
        </button>
      </form>

      {/* Signup Link */}
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-6">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          className="font-medium text-black dark:text-white hover:underline cursor-pointer"
        >
          Sign up
        </span>
      </p>
    </div>
  );
};

export default LoginPage;
