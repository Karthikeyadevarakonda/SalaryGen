import { useState } from "react";
import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { FaUserTie, FaBars, FaPowerOff } from "react-icons/fa";
import { FiHome, FiSettings, FiBarChart2, FiPieChart, FiUser } from "react-icons/fi";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

import Dashboard from "../adminComponents/Dashboard";
import Reports from "../adminComponents/Reports";
import SalaryComponents from "../adminComponents/SalaryComponents";
import GenerateSalaries from "../adminComponents/GenerateSalaries";
import Profile from "./Profile";
import { useAuth } from "../contexts/AuthContext";

const HrDashboard = () => {
    const {logout} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { colors, isDarkMode } = useTheme();
  let {username} = useAuth();

   username = username
    ? username.charAt(0).toUpperCase() + username.slice(1)
    : "Staff";

  const logout_ = () => {
    logout();
    navigate("/login");
  }

  const menuItems = [
    { path: "/hrDashboard", label: "Dashboard", icon: <FiHome /> },
    { path: "/hrDashboard/profile", label: "Profile", icon: <FiUser /> },
    { path: "/hrDashboard/salaryComponents", label: "Salary Components", icon: <FiSettings /> },
    { path: "/hrDashboard/generateSalaries", label: "Generate Salaries", icon: <FiBarChart2 /> },
    { path: "/hrDashboard/reports", label: "Reports", icon: <FiPieChart /> },
  ];

  return (
    <div className={`min-h-screen ${colors.primary} ${colors.text} flex transition-colors duration-300`}>
      {/* Mobile header */}
      <div
        className={`fixed top-0 left-0 right-0 ${colors.secondary} ${colors.border} border-b p-2 flex items-center justify-between md:hidden z-50 transition-colors duration-300`}
      >
        <button onClick={() => setSidebarOpen(true)} className={`${colors.textMuted} text-2xl`}>
          <FaBars />
        </button>
        <h1 className={`text-lg font-bold ${colors.text}`}>
          Welcome, {username}
        </h1>
      </div>

      {/* Sidebar */}
      <aside
        className={`w-64 fixed h-full z-50 flex flex-col justify-between transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 ${colors.secondary} ${colors.border} border-r`}
      >
        <div>
          {/* Sidebar header */}
          <div
            className={`p-6 text-lg md:text-2xl font-bold border-b flex items-center gap-2
              ${isDarkMode ? "border-slate-700 text-white" : "border-slate-300 text-gray-600"}`}
          >
            <FaUserTie className={isDarkMode ? "text-teal-300" : "text-blue-400"} />
            HR Panel
          </div>

          {/* Sidebar nav */}
          <nav className="mt-4">
            <ul className={`space-y-1 ${colors.textSecondary}`}>
              {menuItems.map((item, idx) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={idx}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition relative
                        ${
                          isActive
                            ? `${colors.secondary} font-semibold 
                               ${
                                 isDarkMode
                                   ? "text-teal-400 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-teal-400"
                                   : "text-blue-500 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-blue-500"
                               }`
                            : `${colors.hover} ${isDarkMode ? "hover:text-teal-300" : "hover:text-blue-400"}`
                        }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className={`${colors.border} border-t`}>
          <li
            onClick={logout_}
            className={`flex items-center gap-3 px-6 py-4 cursor-pointer ${colors.text} ${colors.hover} transition-colors`}
          >
            <FaPowerOff />
            Logout
          </li>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 ml-0 md:ml-64 p-6 mt-16 md:mt-0 overflow-x-hidden transition-colors duration-300">
        <header
          className={`hidden md:flex items-center justify-between gap-4 mb-6 ${colors.card} ${colors.border} border rounded-lg px-6 py-4 shadow w-full transition-colors duration-300`}
        >
          <h1
            className={`text-xl font-bold bg-clip-text text-transparent
              ${isDarkMode
                ? "bg-gradient-to-r from-teal-300 via-cyan-300 to-slate-300"
                : "bg-gradient-to-r from-blue-500 via-blue-400 to-slate-400"}`}
          >
            <span className="text-amber-300">🌟</span> Welcome, {username}
          </h1>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={logout_}
              className={`px-4 py-2 rounded-lg ${colors.buttonSecondary} ${colors.textSecondary} font-semibold shadow transition-transform hover:scale-105`}
            >
              Log Out
            </button>
          </div>
        </header>

        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="generateSalaries" element={<GenerateSalaries />} />
          <Route path="salaryComponents" element={<SalaryComponents />} />
          <Route path="reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  );
};

export default HrDashboard;
