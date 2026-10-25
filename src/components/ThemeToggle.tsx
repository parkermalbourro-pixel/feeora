import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const label = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`relative inline-flex items-center justify-center gap-2 p-2 rounded-xl transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-[#6750D8] dark:focus:ring-[#B5A5FF] focus:ring-offset-2 ${
        isDark
          ? 'bg-[#191923] text-amber-300 border-[#333242] hover:bg-[#21202D] focus:ring-offset-[#11111A]'
          : 'bg-[#FAF9FC] text-[#191725] border-[#E9E7EF] hover:bg-[#F4F2F8] focus:ring-offset-[#FAF9FC]'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-300 transition-transform duration-200" />
        ) : (
          <Moon className="w-4 h-4 text-[#686778] transition-transform duration-200" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-medium text-[#191725] dark:text-[#F7F6FC]">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};
