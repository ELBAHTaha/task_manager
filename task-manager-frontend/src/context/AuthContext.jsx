import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    email: localStorage.getItem("email") || "",
    token: localStorage.getItem("token") || "",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Check token validity on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (token && email) {
      // Check if token is still valid by checking expiration
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Date.now() / 1000;

        if (payload.exp < currentTime) {
          // Token expired, clear it
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          setUser({ token: "", email: "" });
        } else {
          setUser({ token, email });
        }
      } catch (error) {
        // Invalid token format, clear it
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        setUser({ token: "", email: "" });
      }
    }

    setIsLoading(false);
  }, []);

  const login = (token, email) => {
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    setUser({ token, email });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setUser({ token: "", email: "" });
  };

  const isAuthenticated = () => {
    if (!user.token) return false;

    try {
      const payload = JSON.parse(atob(user.token.split(".")[1]));
      const currentTime = Date.now() / 1000;

      if (payload.exp < currentTime) {
        // Token expired, logout user
        logout();
        return false;
      }

      return true;
    } catch (error) {
      // Invalid token, logout user
      logout();
      return false;
    }
  };

  const handleTokenExpiration = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        isLoading,
        handleTokenExpiration,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
