import React, { useEffect, useState } from "react";
import {
  X,
  Home,
  ListTodo,
  BarChart,
  User,
  Settings,
  LogOut,
  LogIn,
  Clock,
} from "lucide-react";
import LoginModal from "./LoginModal";

export default function Sidebar({
  isOpen,
  toggleSidebar,
  activeView,
  setActiveView,
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleAuthAction = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      alert("Logged out successfully!");
    } else {
      setShowLogin(true);
    }
  };

  const links = [
    { name: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { name: "Tasks", icon: <ListTodo className="w-5 h-5" /> },
    { name: "Recent Activity", icon: <Clock className="w-5 h-5" /> },
    { name: "Stats", icon: <BarChart className="w-5 h-5" /> },
    { name: "Profile", icon: <User className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        onClick={toggleSidebar}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      ></div>

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 
        text-white transform transition-all duration-300 ease-in-out z-40 shadow-2xl
        w-72 sm:w-80 flex flex-col justify-between border-r border-gray-800
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static`}
      >
        {/* Mobile header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800 md:hidden">
          <h2 className="text-lg font-semibold text-blue-400 tracking-wide">
            Menu
          </h2>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-700/70 transition"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* Sidebar main content */}
        <div className="flex flex-col justify-between h-full px-5 py-6 overflow-y-auto">
          <div>
            <h1 className="text-2xl font-bold mb-10 text-center text-blue-400 tracking-wide hidden md:block">
              My Dashboard
            </h1>

            <ul className="space-y-2">
              {links.map((link) => (
                <li
                  key={link.name}
                  onClick={() => {
                    setActiveView(link.name);
                    if (window.innerWidth < 768) toggleSidebar(); // ✅ Auto-close on mobile
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                    ${
                      activeView === link.name
                        ? "bg-blue-600/20 text-blue-400 shadow-inner border border-blue-700/40"
                        : "text-gray-300 hover:bg-blue-600/10 hover:text-blue-400"
                    }`}
                >
                  <span className="flex-shrink-0">{link.icon}</span>
                  <span className="text-sm md:text-base font-medium tracking-wide">
                    {link.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer section */}
          <div className="border-t border-gray-800 pt-5 mt-6 space-y-3">
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-gray-800/70 transition-all duration-200"
            >
              <Settings className="w-5 h-5 text-gray-300" />
              <span className="text-sm md:text-base font-medium tracking-wide">
                Settings
              </span>
            </div>

            <div
              onClick={handleAuthAction}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                ${
                  isLoggedIn
                    ? "hover:bg-red-600/10 text-red-400 border border-transparent hover:border-red-700/40"
                    : "hover:bg-green-600/10 text-green-400 border border-transparent hover:border-green-700/40"
                }`}
            >
              {isLoggedIn ? (
                <>
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm md:text-base font-medium">
                    Logout
                  </span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span className="text-sm md:text-base font-medium">
                    Login
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 text-xs text-center pt-4 tracking-wide">
              © 2025 My Dashboard
            </p>
          </div>
        </div>
      </aside>

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
    </>
  );
}
