import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import { FiMenu, FiX } from "react-icons/fi";
import { useDarkMode } from "../auth/DarkModeContext";
import { useNavigate } from "react-router-dom";

export default function EditorDashboard() {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();

  const [section, setSection] = useState("queue");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [queue, setQueue] = useState([]);
  const [approvedList, setApprovedList] = useState([]);
  const [rejectedList, setRejectedList] = useState([]);
  const [commentMap, setCommentMap] = useState({});

  const [approveLoading, setApproveLoading] = useState({});
  const [rejectLoading, setRejectLoading] = useState({});

  async function load() {
    try {
      const res = await API.get("/articles/editor/queue");
      setQueue(res.data);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }

    try {
      const approved = await API.get("/articles/editor/approved");
      setApprovedList(approved.data);
    } catch { }

    try {
      const rejected = await API.get("/articles/editor/rejected");
      setRejectedList(rejected.data);
    } catch { }
  }

  useEffect(() => {
    load();
  }, []);


  const approve = async (id) => {
    if (approveLoading[id]) return;

    setApproveLoading((prev) => ({ ...prev, [id]: true }));

    try {
      await API.patch(`/articles/${id}/approve`);
      alert("Approved — email sent");
      load();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }

    setApproveLoading((prev) => ({ ...prev, [id]: false }));
  };


  const reject = async (id) => {
    const comment = commentMap[id]?.trim();
    if (!comment) return alert("Comment is required");

    if (rejectLoading[id]) return;

    setRejectLoading((prev) => ({ ...prev, [id]: true }));

    try {
      await API.patch(`/articles/${id}/reject`, { comment });
      alert("Rejected — email sent");
      load();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }

    setRejectLoading((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div
      className={`min-h-screen flex transition-colors duration-300 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
        }`}
    >
      <Sidebar
        role="Editor"
        darkMode={darkMode}
        section={section}
        setSection={setSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="flex-1 p-6 md:p-10 relative">
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          />
        )}

        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className={`absolute top-4 right-4 z-40 p-2 rounded-md md:hidden ${darkMode ? "bg-gray-700" : "bg-white"
              }`}
          >
            <FiMenu size={24} />
          </button>
        )}


        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className={`fixed top-4 left-52 z-70 p-2 rounded-md md:hidden ${darkMode ? "bg-gray-700" : "bg-white"
              }`}
          >
            <FiX size={24} />
          </button>
        )}

        {section === "queue" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Pending Articles</h2>


            {queue.length === 0 && <p>No pending articles.</p>}

            {queue.map((a) => (
              <div
                key={a._id}
                className={`p-5 rounded-lg shadow mb-4 ${darkMode ? "bg-gray-800" : "bg-white"
                  }`}
              >
                <h3 className="text-xl font-semibold">{a.title}</h3>
                <p className="text-sm text-gray-400">By {a.author?.name}</p>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:gap-3">

                  <a
                    className="text-blue-500 underline mb-3 sm:mb-0 sm:mr-4"
                    href={`/article/${a._id}`}
                    target="_blank"
                  >
                    Open Article
                  </a>

                  <div className="flex gap-2 mb-3 sm:mb-0">
                    <button
                      disabled={approveLoading[a._id]}
                      className={`px-3 py-1 text-white rounded ${approveLoading[a._id]
                          ? "bg-green-400 cursor-not-allowed"
                          : "bg-green-600"
                        }`}
                      onClick={() => approve(a._id)}
                    >
                      {approveLoading[a._id] ? "Approving…" : "Approve"}
                    </button>

                    <button
                      disabled={rejectLoading[a._id]}
                      className={`px-3 py-1 text-white rounded ${rejectLoading[a._id]
                          ? "bg-red-400 cursor-not-allowed"
                          : "bg-red-600"
                        }`}
                      onClick={() => reject(a._id)}
                    >
                      {rejectLoading[a._id] ? "Rejecting…" : "Reject"}
                    </button>
                  </div>

                  <input
                    placeholder="Rejection Comment"
                    className={`border p-2 rounded w-full sm:w-auto ${darkMode ? "bg-gray-700 border-gray-600" : ""
                      }`}
                    value={commentMap[a._id] || ""}
                    onChange={(e) =>
                      setCommentMap({
                        ...commentMap,
                        [a._id]: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {section === "approved" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Approved Articles</h2>

            {approvedList.length === 0 && <p>No approved articles.</p>}

            {approvedList.map((a) => (
              <div
                key={a._id}
                onClick={() => navigate(`/article/${a._id}`)}
                className={`p-5 rounded-lg shadow mb-4 ${darkMode ? "bg-gray-800" : "bg-white"
                  }`}
              >
                <h3 className="text-xl font-semibold">{a.title}</h3>
                <p className="text-green-400">Approved by Me</p>
              </div>
            ))}
          </div>
        )}

        {section === "rejected" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Rejected Articles</h2>

            {rejectedList.length === 0 && <p>No rejected articles.</p>}

            {rejectedList.map((a) => (
              <div
                key={a._id}
                onClick={() => navigate(`/article/${a._id}`)}
                className={`p-5 rounded-lg shadow mb-4 ${darkMode ? "bg-gray-800" : "bg-white"
                  }`}
              >
                <h3 className="text-xl font-semibold">{a.title}</h3>
                <p className="text-red-400">Reason: {a.editorComment}</p>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
