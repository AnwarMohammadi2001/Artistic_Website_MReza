// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );

  // Auto-logout after 24 hours
  useEffect(() => {
    const loginTime = localStorage.getItem("loginTime");
    if (loginTime) {
      const now = Date.now();
      const hoursPassed = (now - parseInt(loginTime, 10)) / (1000 * 60 * 60);
      if (hoursPassed >= 24) {
        logout();
      }
    }
  }, []);

  // Sync state with localStorage
  useEffect(() => {
    if (user && token) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("loginTime", Date.now().toString());
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("loginTime");
    }
  }, [user, token]);

  // Login function
  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
  };

  // Logout function
  const logout = () => {
     localStorage.removeItem("token");
     localStorage.removeItem("user");
     localStorage.removeItem("loginTime");
     setUser(null);
     setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
