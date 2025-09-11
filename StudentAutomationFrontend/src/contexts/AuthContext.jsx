import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth, bir AuthProvider içinde kullanılmalıdır");
  }
  return context;
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    console.log("AuthContext - Token from localStorage:", token);
    console.log("AuthContext - UserData from localStorage:", userData);

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log("AuthContext - Parsed user:", parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("AuthContext - Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // login fonksiyonuna da debug ekleyelim
  const login = (token, userData) => {
    console.log("AuthContext - Login with:", { token, userData });
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Çıkış yapma fonksiyonu
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Context value
  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
