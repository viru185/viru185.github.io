import React, { useEffect } from 'react';
import './assets/styles/light.css';
import './assets/styles/dark.css';

const ThemeToggle = ({ isDarkMode, toggleTheme }) => {
  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  }, [isDarkMode]);

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      style={{
        padding: '8px 18px',
        borderRadius: '20px',
        border: 'none',
        background: isDarkMode ? '#333' : '#e0e0e0',
        color: isDarkMode ? '#bb86fc' : '#0073e6',
        fontWeight: 'bold',
        fontSize: '1rem',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        margin: '16px auto',
        display: 'block',
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
};

export default ThemeToggle;