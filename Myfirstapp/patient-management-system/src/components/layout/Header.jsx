import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, User, LogOut, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, profile, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Menu button */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition lg:hidden"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-xl font-semibold text-gray-800 hidden md:block">
            Welcome back, {profile?.name || 'User'}!
          </h2>
        </div>

        {/* Right side - Notifications & Profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {profile?.name || user?.email?.split('@')[0]}
              </span>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-30"
              >
                <button
                  onClick={() => window.location.href = '/settings'}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <hr className="my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;