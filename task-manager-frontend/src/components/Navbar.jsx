import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { isAuthenticated, userEmail, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow mb-4">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/projects" className="text-xl font-semibold text-blue-600">
          Task Manager
        </Link>
        {isAuthenticated && (
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600 hidden sm:inline">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-xs sm:text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}


