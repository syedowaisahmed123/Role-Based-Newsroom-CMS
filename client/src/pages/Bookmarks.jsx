import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../auth/AuthProvider';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../auth/DarkModeContext';
import { BsBookmarkFill } from "react-icons/bs";

export default function Bookmarks() {
  const { user } = useAuth();
  const { darkMode } = useDarkMode();
  const [bookmarks, setBookmarks] = useState([]);
        console.log("bookmark", bookmarks)


  useEffect(() => {
    async function load() {
      try {
        const res = await API.get('/users/me');
        setBookmarks(res.data.bookmarks || []);
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
    load();
  }, []);

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center text-lg 
        ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-800"}`}>
        Please login to see bookmarks.
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-10 px-4 sm:px-6 transition-colors duration-300 
      ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>

      <div className="max-w-4xl mx-auto mb-8 flex items-center gap-3">
        <BsBookmarkFill size={26} className={`${darkMode ? "text-yellow-400" : "text-blue-600"}`} />
        <h1 className="text-3xl font-bold">Your Bookmarks</h1>
      </div>

      <div className="max-w-4xl mx-auto">
        
        {bookmarks.length === 0 && (
          <div className={`p-6 text-center rounded-xl shadow 
            ${darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"}`}>
            You haven’t bookmarked any articles yet.
          </div>
        )}

        <div className="grid gap-5">
          {bookmarks.map(b => (
            <div key={b._id} 
              className={`p-5 rounded-xl shadow-md border transition-all duration-300 
              hover:shadow-lg hover:-translate-y-1 
              ${darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-800"}`}
            >
              <h2 className="text-xl font-semibold mb-1">{b.title}</h2>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>
                By {b.author?.name || "Unknown"}
              </p>

              <Link 
                to={`/article/${b._id}`} 
                className={`inline-block mt-3 font-medium transition-colors 
                ${darkMode ? "text-yellow-400 hover:text-yellow-300" : "text-blue-600 hover:underline"}`}
              >
                Read Article →
              </Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
