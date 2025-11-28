import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { useDarkMode } from '../auth/DarkModeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const { darkMode, toggleDarkMode } = useDarkMode();
    const firstName = user?.name?.split(" ")[0] ?? "";



  return (
<header className={`fixed top-0 left-0 w-full z-50 shadow transition-colors duration-500 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
        
        <div className="flex items-center justify-between w-full sm:w-auto">
          <Link to="/" className="text-2xl font-bold">Newsroom</Link>

          <button onClick={toggleDarkMode} className="sm:hidden ml-3 text-xl transition-transform duration-500 hover:scale-110">
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/" className="hover:underline">Home</Link>
          {user?.role === 'Reader' && <Link to="/bookmarks" className="hover:underline">Bookmarks</Link>}
          {user?.role === 'Writer' && <Link to="/writer" className="hover:underline">Writer</Link>}
          {user?.role === 'Editor' && <Link to="/editor" className="hover:underline">Editor</Link>}
          {user?.role === 'Admin' && <Link to="/admin" className="hover:underline">Admin</Link>}

          {user ? (
            <>
              <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">{firstName} • {user.role}</span>
              <button
                onClick={() => { logout(); nav('/'); }}
                className="px-3 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Login</Link>
              <Link to="/signup" className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Signup</Link>
            </>
          )}

          <button onClick={toggleDarkMode} className="ml-2 text-xl transition-transform duration-500 hover:scale-110 hidden sm:block">
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
        </div>
      </div>
    </header>
  );
}
