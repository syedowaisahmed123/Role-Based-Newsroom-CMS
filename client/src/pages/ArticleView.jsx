import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import DOMPurify from "dompurify";
import { useAuth } from "../auth/AuthProvider";
import { useDarkMode } from "../auth/DarkModeContext";
import { FiArrowLeft, FiBookmark } from "react-icons/fi";
import { FaBookmark } from "react-icons/fa";
import "../styles/article.css";

export default function ArticleView() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { user } = useAuth();
  const { darkMode } = useDarkMode();
  const nav = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await API.get(`/articles/${id}`);
        const data = res.data;

        setArticle(data.article || data); 

        if (user?.role === "Reader") {
          const bookmarkedIds = data.user?.bookmarks?.map((b) => b._id);
          setIsBookmarked(bookmarkedIds?.includes(data.article?._id || data._id));
        }
      } catch (err) {
        if (err.response?.status === 403) nav("/login");
        else alert(err.response?.data?.message || err.message);
      }
    }
    load();
  }, [id, user, nav]);

  if (!article) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
        }`}
      >
        <p className="text-lg">Loading article...</p>
      </div>
    );
  }

  const handleBookmark = async () => {
    if (!user) return nav("/login");

    try {
      await API.patch(`/articles/${id}/bookmark`);
      setIsBookmarked((prev) => !prev);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10 relative">

        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => nav(-1)}
            className="flex items-center gap-2 text-lg hover:opacity-70 transition"
          >
            <FiArrowLeft size={22} />
            Back
          </button>

          {user?.role === "Reader" && (
            <button
              onClick={handleBookmark}
              className="text-2xl transition-transform hover:scale-110"
            >
              {isBookmarked ? (
                <FaBookmark className="text-blue-600" />
              ) : (
                <FiBookmark
                  className={darkMode ? "text-gray-300" : "text-gray-700"}
                />
              )}
            </button>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-3">{article.title}</h1>

        <p
          className={`text-sm mb-6 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          By <span className="font-medium">{article.author?.name}</span> •{" "}
          {new Date(article.createdAt).toLocaleDateString()}
        </p>

        <div
          className={`article-content max-w-none transition-colors duration-500 ${
            darkMode ? "dark" : ""
          }`}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(article.bodyHtml),
          }}
        ></div>

        {user?.role === "Reader" && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-2 px-5 py-2 rounded shadow text-white transition 
                ${
                  isBookmarked
                    ? "bg-blue-700 hover:bg-blue-800"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {isBookmarked ? <FaBookmark /> : <FiBookmark />}
              {isBookmarked ? "Bookmarked" : "Save / Bookmark"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
