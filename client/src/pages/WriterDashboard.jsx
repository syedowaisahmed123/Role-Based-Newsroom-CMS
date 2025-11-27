import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiEdit2 } from "react-icons/fi";
import WriterArticleForm from "../components/WriterArticleForm";
import ArticleEditModal from "../components/ArticleEditModal";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";
import { useDarkMode } from "../auth/DarkModeContext";

export default function WriterDashboard() {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();

  const [section, setSection] = useState("create");
  const [mySubmitted, setMySubmitted] = useState([]);
  const [myApproved, setMyApproved] = useState([]);
  const [myRejected, setMyRejected] = useState([]);

  const [editors, setEditors] = useState([]);

  const [editModalOpen, setEditModalOpen] = useState(false);

  const [articleId, setArticleId] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [assignedEditor, setAssignedEditor] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const loadData = async () => {
    const res = await API.get("/articles/mine/me");
    setMySubmitted(res.data.filter((a) => a.status === "Submitted"));
    setMyApproved(res.data.filter((a) => a.status === "Approved"));
    setMyRejected(res.data.filter((a) => a.status === "Rejected"));

    const users = await API.get("/users");
    setEditors(users.data.filter((u) => u.role === "Editor"));
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setArticleId(null);
    setTitle("");
    setBody("");
    setAssignedEditor("");
  };

  const submit = async () => {
    if (loadingSubmit) return;

    if (!title.trim() || !body.trim() || !assignedEditor.trim()) {
      alert("All fields are required.");
      return;
    }

    setLoadingSubmit(true);

    try {
      if (articleId) {
        await API.patch(`/articles/rejected/update/${articleId}`, {
          title,
          bodyHtml: body,
        });
        alert("Article Updated & Resubmitted!");
        setEditModalOpen(false);
      } else {
        await API.post("/articles", {
          title,
          bodyHtml: body,
          assignedEditorbywriter: assignedEditor,
        });
        alert("Article Submitted!");
      }

      resetForm();
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }

    setLoadingSubmit(false);
  };

  const editRejected = (article) => {
    setArticleId(article._id);
    setTitle(article.title);
    setBody(article.bodyHtml);
    setAssignedEditor(article.assignedEditorbywriter);
    setEditModalOpen(true);
  };

  return (
    <div
      className={`min-h-screen flex ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-800"
      }`}
    >
      <Sidebar
        role="Writer"
        darkMode={darkMode}
        section={section}
        setSection={setSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
        />
      )}

      <main className="flex-1 p-6 md:p-10 relative">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className={`absolute top-4 right-4 z-40 p-2 rounded-md md:hidden ${
              darkMode ? "bg-gray-700 text-gray-100" : "bg-white text-gray-900"
            }`}
          >
            <FiMenu size={24} />
          </button>
        )}

        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className={`fixed top-4 left-50 z-70 p-2 rounded-md md:hidden ${
              darkMode ? "bg-gray-700 text-gray-100" : "bg-white text-gray-900"
            }`}
          >
            <FiX size={24} />
          </button>
        )}

        {section === "create" && (
          <WriterArticleForm
            articleId={articleId}
            title={title}
            setTitle={setTitle}
            body={body}
            setBody={setBody}
            assignedEditor={assignedEditor}
            setAssignedEditor={setAssignedEditor}
            editors={editors}
            darkMode={darkMode}
            onSubmit={submit}
            loadingSubmit={loadingSubmit}
          />
        )}

        {section === "approved" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">My Approved Articles</h2>

            {myApproved.length === 0 && (
              <p className="text-gray-400 text-lg">No approved articles.</p>
            )}

            {myApproved.map((a) => (
              <div
                key={a._id}
                onClick={() => navigate(`/article/${a._id}`)}
                className={`p-5 rounded-lg shadow mb-4 cursor-pointer ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3 className="text-xl font-semibold">{a.title}</h3>
                <p className="text-green-400 font-medium">Status: Approved</p>
              </div>
            ))}
          </div>
        )}

        {section === "Submitted" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">My Submitted Articles</h2>

            {mySubmitted.length === 0 && (
              <p className="text-gray-400 text-lg">No submitted articles.</p>
            )}

            {mySubmitted.map((a) => (
              <div
                key={a._id}
                className={`p-5 rounded-lg shadow mb-4 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3 className="text-xl font-semibold">{a.title}</h3>
                <p className="text-yellow-300 font-medium">Status: Submitted</p>
              </div>
            ))}
          </div>
        )}

        {section === "rejected" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">My Rejected Articles</h2>

            {myRejected.length === 0 && (
              <p className="text-gray-400 text-lg">No rejected articles.</p>
            )}

            {myRejected.map((a) => (
              <div
                key={a._id}
                className={`p-5 rounded-lg shadow mb-4 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3 className="text-xl font-semibold">{a.title}</h3>
                <p className="text-red-400">Reason: {a.editorComment}</p>

                <button
                  onClick={() => editRejected(a)}
                  className="mt-3 px-4 py-1 flex items-center gap-2 rounded bg-blue-600 text-white hover:bg-blue-500"
                >
                  <FiEdit2 /> Edit & Resubmit
                </button>
              </div>
            ))}
          </div>
        )}

        <ArticleEditModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            resetForm();
          }}
          articleId={articleId}
          title={title}
          setTitle={setTitle}
          body={body}
          setBody={setBody}
          assignedEditor={assignedEditor}
          setAssignedEditor={setAssignedEditor}
          editors={editors}
          darkMode={darkMode}
          onSubmit={submit}
          loadingSubmit={loadingSubmit}
        />
      </main>
    </div>
  );
}
