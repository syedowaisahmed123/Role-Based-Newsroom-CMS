import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useDarkMode } from '../auth/DarkModeContext';

export default function SearchArticles() {
  const { darkMode } = useDarkMode();
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  const fetchResults = async (query) => {
    if (!query) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await API.get('/articles/search', { params: { q: query, limit: 10, page: 1 } });
      setResults(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchResults(q), 300); // 300ms delay
    return () => clearTimeout(debounceRef.current);
  }, [q]);

  return (
    <div className={`relative max-w-xl mx-auto p-4`}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by title or author..."
        className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500
          ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
      />

      {q && results.length > 0 && (
        <div className={`absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded shadow-md max-h-64 overflow-y-auto`}>
          {results.map((a) => (
            <div
              key={a._id}
              onClick={() => navigate(`/article/${a._id}`)}
              className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <p className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{a.title}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>By {a.author?.name}</p>
            </div>
          ))}
        </div>
      )}

      {q && !loading && results.length === 0 && (
        <div className="absolute z-10 w-full mt-1 p-2 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border rounded">
          No results found
        </div>
      )}
    </div>
  );
}
