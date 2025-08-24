import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = ({ className = "" }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
  onClick={toggleTheme}
  className={`p-2 rounded-lg transition-all duration-500 ease-in-out hover:scale-110 ${
    isDarkMode 
      ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400' 
      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
  } ${className}`}
  title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
>
  <span className="text-xl">
    {isDarkMode ? '🌞' : '🌙'}
  </span>
</button>

  );
};

export default ThemeToggle;