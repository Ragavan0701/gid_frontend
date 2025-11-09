import React, { useState } from "react";
import { Menu, Search, X, Bell, MessageSquare } from "lucide-react";

export default function Navbar({ onMenuClick, onSearchChange }) {
  const [showSearch, setShowSearch] = useState(false);
  // const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 
        
          bg-white/70 border-b border-gray-200 text-gray-800
       backdrop-blur-lg shadow-sm px-4 py-3 flex items-center justify-between`}
    >
      {/* ---------- Left Section ---------- */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-gray-200/40 transition"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent select-none whitespace-nowrap">
          Personal Dashboard
        </h1>
      </div>

      {/* ---------- Center Section (Search Input) ---------- */}
      <div className="hidden sm:flex flex-1 justify-center">
        <div
          className={`flex items-center group border rounded-full px-3 py-1 shadow-inner transition-all duration-300  bg-gray-100 border-gray-300 focus-within:ring-2 focus-within:ring-blue-400/60 hover:scale-[1.03] hover:shadow-lg backdrop-blur-md w-full max-w-md`}
        >
          <Search
            className={`w-5 h-5 mr-2 transition-all duration-200 text-blue-500 group-focus-within:text-blue-600`}
          />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearch}
            className={`outline-none text-sm w-full bg-transparent placeholder:italic transition-all duration-300 text-gray-800 placeholder-gray-500`}
            
          />
        </div>
      </div>

      {/* ---------- Right Section ---------- */}
      <div className="flex items-center gap-3 sm:gap-4 relative">
        {/* Mobile Search Toggle */}
        <button
          className={`sm:hidden p-2 rounded-full hover:scale-110 transition-transform bg-gray-100 hover:bg-gray-200`}
          onClick={() => setShowSearch(!showSearch)}
        >
          {showSearch ? (
            <X className="w-5 h-5 text-red-500" />
          ) : (
            <Search className="w-5 h-5 text-blue-500" />
          )}
        </button>

        {/* Notification Button */}
        <div className="relative">
          <button
            className={`p-2 rounded-full hover:scale-110 transition-transform bg-gray-100 hover:bg-gray-200`}
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-500" />
          </button>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>

        {/* Messages */}
        <button
          className={`p-2 rounded-full hover:scale-110 transition-transform bg-gray-100 hover:bg-gray-200`}
          title="Messages"
        >
          <MessageSquare className="w-5 h-5 text-blue-500" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-white shadow-md hover:scale-110 transition-transform cursor-pointer"></div>
      </div>

      {/* ---------- Mobile Search Input ---------- */}
      {showSearch && (
        <div
          className={`absolute top-16 left-4 right-4 flex items-center border rounded-full px-3 py-2 shadow-md transition-all duration-300 bg-white border-gray-300`}
        >
          <Search className="w-5 h-5 mr-2 text-blue-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearch}
            className={`w-full bg-transparent outline-none text-sm text-gray-800`}
          />
        </div>
      )}
    </nav>
  );
}
