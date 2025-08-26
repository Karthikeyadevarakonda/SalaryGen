import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true; 
  });

  useEffect(() => {
  const themeClass = isDarkMode ? 'dark' : 'light';
  localStorage.setItem('theme', themeClass);

  document.documentElement.classList.remove('dark', 'light');
  document.documentElement.classList.add(themeClass);
}, [isDarkMode]);


  const toggleTheme = () => {
  const overlay = document.createElement("div");
  overlay.className = "fixed inset-0 bg-gradient-to-br from-black/40 to-white/40 z-[9999] pointer-events-none opacity-0 transition-opacity duration-500";
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.classList.add("opacity-100");
    setTimeout(() => {
      overlay.classList.remove("opacity-100");
      setTimeout(() => overlay.remove(), 500);
    }, 300);
  });

  setIsDarkMode(!isDarkMode);
};


  const theme = {
    isDarkMode,
    toggleTheme,
    colors: isDarkMode
      ? {
          
          primary: 'bg-slate-900',
          secondary: 'bg-slate-800',
          accent: 'bg-teal-500',
          text: 'text-white',
          textSecondary: 'text-slate-300',
          textMuted: 'text-slate-400',
          border: 'border-slate-700',
          hover: 'hover:bg-slate-700',
          card: 'bg-slate-800',
          input: 'bg-slate-900',
          button: 'bg-teal-500 hover:bg-teal-400',
          buttonSecondary: 'bg-slate-700 hover:bg-slate-600',
       
          table: 'bg-slate-800',
          tableHeader: 'bg-slate-700 text-slate-200',
          tableRow: 'hover:bg-slate-700',
        }
      : {
          
          primary: 'bg-white',
          secondary: 'bg-slate-50',
          accent: 'bg-blue-500',
          text: 'text-slate-900',
          textSecondary: 'text-slate-700',
          textMuted: 'text-slate-500',
          border: 'border-slate-200',
          hover: 'hover:bg-slate-100',
          card: 'bg-white',
          input: 'bg-white',
          button: 'bg-blue-500 hover:bg-blue-600',
          buttonSecondary: 'bg-slate-200 hover:bg-slate-300',
          
          table: 'bg-white',
          tableHeader: 'bg-blue-100 text-slate-800',
          tableRow: 'hover:bg-slate-100',
        },
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
