import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { FaArtstation } from "react-icons/fa";
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import ChatBot from '../contexts/ChatBot';
import { useAuth } from '../contexts/AuthContext';

const App= () => {
  const [isOpen, setIsOpen] = useState(false);
  const {token} = useAuth();
  const { colors } = useTheme();

  const points = [
    [0, 70], [50, 60], [100, 80], [150, 50], [200, 75], [250, 60], [300, 85],
  ];
  
  const pathD = `M ${points.map(([x, y]) => `${x},${y}`).join(' L ')}`;

  return (
    <div className={`min-h-screen ${colors.primary} ${colors.text} flex flex-col transition-colors duration-300`}>
      
      <header className={`${colors.secondary} ${colors.border} border-b transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className={`text-xl sm:text-2xl font-bold ${colors.text} gap-2 flex items-center`}>
            <FaArtstation className={colors.textSecondary} /> SalaryGen
          </h1>

          
          <nav className={`hidden md:flex items-center space-x-4 lg:space-x-6 text-sm ${colors.textSecondary}`}>
            <Link to="/features" className={`italic font-semibold hover:${colors.accent.includes('teal') ? 'text-teal-400' : 'text-blue-500'} transition-colors`}>Features</Link>
            <Link to="/aboutUs" className={`italic font-semibold hover:${colors.accent.includes('teal') ? 'text-teal-400' : 'text-blue-500'} transition-colors`}>About Us</Link>
            <ThemeToggle />
            <Link
              to="/login"
              className={`italic font-semibold ${colors.button} text-white px-4 py-2 rounded transition-colors`}
            >
              {token ? "Dashboard" : "Login"}
            </Link>
            {!token && (
              <Link
                to="/register"
                className={`italic font-semibold ${colors.buttonSecondary} ${colors.text} px-4 py-2 rounded transition-colors`}
              >
                Register
              </Link>
            )}
          </nav>

          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden ${colors.textSecondary} focus:outline-none`}
          >
            {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>

        
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className={`overflow-hidden md:hidden ${colors.secondary} ${colors.border} border-t transition-colors duration-300`}
        >
          <div className={`px-6 py-4 space-y-4 text-sm ${colors.textSecondary}`}>
            <Link to="/features" className={`block hover:${colors.accent.includes('teal') ? 'text-teal-400' : 'text-blue-500'} transition-colors`} onClick={() => setIsOpen(false)}>Features</Link>
            <Link to="/aboutUs" className={`block hover:${colors.accent.includes('teal') ? 'text-teal-400' : 'text-blue-500'} transition-colors`} onClick={() => setIsOpen(false)}>About Us</Link>
            <div className="flex items-center justify-between">
              <ThemeToggle />
            </div>
            <Link to="/login" className={`block hover:${colors.accent.includes('teal') ? 'text-teal-400' : 'text-blue-500'} transition-colors`} onClick={() => setIsOpen(false)}>
              {token ? "Dashboard" : "Login"}
            </Link>
            {!token && (
              <Link
                to="/register"
                className={`block ${colors.buttonSecondary} ${colors.text} px-4 py-2 rounded transition-colors`}
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            )}
          </div>
        </motion.div>
      </header>

     
      <main className="flex flex-1 flex-col lg:flex-row items-center justify-between px-6 sm:px-10 py-10 sm:py-20 gap-8 sm:gap-10">
        
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl text-center lg:text-left"
        >
          <h2 className={`text-3xl sm:text-4xl font-bold ${colors.text} leading-snug`}>
            Effortless Salary Acquittance <br />
            <span className={colors.accent.includes('teal') ? 'text-teal-400' : 'text-blue-500'}>for Modern HR Teams</span>
          </h2>
          <p className={`mt-4 ${colors.textMuted} text-base sm:text-lg`}>
            Automate payroll, visualize deductions, and generate clean reports in seconds.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
            <Link
              to={"/register"}
              className={`${colors.button} text-white px-6 py-3 rounded transition-colors`}
            >
              Get Started
            </Link>
            <Link
              to={"/features"}
              className={`bg-transparent ${colors.accent.includes('teal') ? 'text-teal-400 border-teal-500' : 'text-blue-500 border-blue-500'} border px-6 py-3 rounded ${colors.hover} transition-colors`}
            >
              Watch Demo
            </Link>
          </div>
        </motion.div>

       
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className={`w-full max-w-md ${colors.card} rounded-xl shadow-md ${colors.border} border p-6 transition-colors duration-300`}
        >
          <h3 className={`text-lg font-semibold ${colors.text} mb-4`}>Net Salary Trend</h3>
          <svg viewBox="0 0 320 100" className={`w-full h-32 ${colors.accent.includes('teal') ? 'text-teal-400' : 'text-blue-500'}`}>
            <motion.path
              d={pathD}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>
          <div className={`flex justify-between text-xs ${colors.textMuted} mt-2`}>
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
          </div>
          <div className={`mt-4 flex items-center gap-2 text-xs ${colors.textMuted}`}>
            <div className={`w-2 h-2 ${colors.accent.includes('teal') ? 'bg-teal-400' : 'bg-blue-500'} rounded-full animate-pulse`}></div>
            Live trend updates enabled
          </div>
        </motion.div>
      </main>
      
         <ChatBot/>
     
      <footer className={`text-center text-xs sm:text-sm ${colors.textMuted} py-4 ${colors.border} border-t transition-colors duration-300`}>
        © 2025 SalaryGen. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
