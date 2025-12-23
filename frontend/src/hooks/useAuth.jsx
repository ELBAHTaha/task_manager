import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, handleApiError } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (savedToken && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setToken(savedToken);
          setUser(parsedUser);

          // Verify token is still valid
          authAPI.getCurrentUser()
            .then((currentUser) => {
              setUser(currentUser);
              localStorage.setItem('user', JSON.stringify(currentUser));
            })
            .catch(() => {
              // Token is invalid, clear auth state
              logout();
            })
            .finally(() => {
              setIsLoading(false);
            });
        } catch (error) {
          console.error('Error parsing saved user:', error);
          logout();
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login(email, password);

      const { token: newToken, ...userData } = response;

      // Save to state
      setToken(newToken);
      setUser(userData);

      // Save to localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: handleApiError(error)
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const { email, password, firstName, lastName } = userData;
      const response = await authAPI.register(email, password, firstName, lastName);

      const { token: newToken, ...user } = response;

      // Save to state
      setToken(newToken);
      setUser(user);

      // Save to localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: handleApiError(error)
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear state
    setUser(null);
    setToken(null);

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirect to login (will be handled by route protection)
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const refreshToken = async () => {
    try {
      const response = await authAPI.refreshToken();
      const { token: newToken, ...userData } = response;

      setToken(newToken);
      setUser(userData);

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      return { success: false, error: handleApiError(error) };
    }
  };

  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for checking if user has specific role
export const useRole = (requiredRole) => {
  const { user } = useAuth();
  return user?.role === requiredRole;
};

// Custom hook for checking if user is admin
export const useIsAdmin = () => {
  const { user } = useAuth();
  return user?.role === 'ADMIN';
};
