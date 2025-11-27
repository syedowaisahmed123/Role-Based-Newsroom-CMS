import React, { useEffect, useState, useRef, useCallback } from 'react';
import API from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../auth/DarkModeContext';

export default function Home() {
  const { darkMode } = useDarkMode();
  const [articles, setArticles] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const loaderRef = useRef(null);
  const loadLock = useRef(false);
  const navigate = useNavigate();
  const suggestionRef = useRef(null);
  const articlesWrapperRef = useRef(null);

  const loadArticles = useCallback(async () => {
    if (loading || loadLock.current) return;
    loadLock.current = true;
    setLoading(true);

    try {
      const res = await API.get('/articles/approved', { params: { page, limit: 10 } });
      setArticles(prev => {
        const all = page === 1 ? res.data.data : [...prev, ...res.data.data];
        const unique = Array.from(new Map(all.map(a => [a._id, a])).values());
        return unique;
      });
      setHasMore(res.data.hasMore);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => (loadLock.current = false), 250);
    }
  }, [page, loading]);

  useEffect(() => {
    if (!q) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setSuggestionsLoading(true);
      try {
        const res = await API.get('/articles/search', { params: { q, limit: 5 } });
        setSuggestions(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setSuggestionsLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [q]);

  useEffect(() => {
    loadArticles();
  }, [page, loadArticles]);

  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) setPage(prev => prev + 1);
    });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  useEffect(() => {
    const handleClickOutside = e => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setSuggestions([]);
        setQ(''); 
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto p-4">

        <div className="mb-6 relative z-30">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search articles by title or author..."
            className={`w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
              ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
          />

          {q && (
            <div ref={suggestionRef} className={`absolute top-full left-0 w-full mt-1 border rounded shadow-lg max-h-64 overflow-y-auto z-20
              ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
              {suggestionsLoading ? (
                <div className="px-4 py-2 text-gray-500 dark:text-gray-400">Loading...</div>
              ) : suggestions.length > 0 ? (
                suggestions.map(article => (
                  <div
                    key={article._id}
                    onClick={() => navigate(`/article/${article._id}`)}
                    className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <p className="font-medium">{article.title}</p>
                    <p className="text-sm">{article.author?.name}</p>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500 dark:text-gray-400">No articles available</div>
              )}
            </div>
          )}
        </div>

        <div
          ref={articlesWrapperRef}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300
            ${q && suggestions.length > 0 ? 'backdrop-blur-sm brightness-55' : ''}`}
        >
          {articles.map(a => (
            <article key={a._id} className={`p-5 rounded-lg shadow-md flex flex-col justify-between transition-all hover:shadow-xl
              ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div>
                <h3 className="text-xl font-bold mb-2 line-clamp-2">{a.title}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  By {a.author?.name || 'Unknown'} • {new Date(a.createdAt).toLocaleDateString()}
                </p>
                <p className={`line-clamp-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{a.excerpt}...</p>
              </div>
              <Link
                to={`/article/${a._id}`}
                className={`mt-4 text-blue-600 dark:text-blue-400 font-semibold hover:underline`}
              >
                Read More →
              </Link>
            </article>
          ))}
        </div>

        <div ref={loaderRef} className="text-center py-6">
          {loading && <p>Loading more articles...</p>}
          {!hasMore && <p>No more articles</p>}
        </div>
      </div>
    </div>
  );
}