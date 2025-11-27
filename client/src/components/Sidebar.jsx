import React from "react";
import { FiFilePlus, FiCheckCircle, FiXCircle, FiEdit2, FiSave } from "react-icons/fi";

export default function Sidebar({ role, darkMode, section, setSection, sidebarOpen, setSidebarOpen }) {
  const sectionsByRole = {
    Writer: [
      { key: "create", label: "Create Article", icon: <FiFilePlus /> },
      { key: "Submitted", label: "Submitted Articles", icon:<FiSave />},
      { key: "approved", label: "Approved Articles", icon: <FiCheckCircle /> },
      { key: "rejected", label: "Rejected Articles", icon: <FiXCircle /> },
      
    ],
    Editor: [
      { key: "queue", label: "Pending Articles", icon: <FiCheckCircle /> },
      { key: "approved", label: "Approved Articles", icon: <FiCheckCircle />},
      { key: "rejected", label: "Rejetced Articles", icon: <FiXCircle />}
    ],
 
      Admin: [
          { key: "create", label: "create E W & A", icon: <FiFilePlus /> },
  { key: "manage", label: "Manage E & W", icon: <FiEdit2 /> },
  { key: "readers", label: "View Readers", icon: <FiSave /> },
  { key: "approvedArticles", label: "Approved Articles", icon: <FiCheckCircle /> }
],

  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 p-6 shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:block
        ${darkMode ? "bg-gray-800" : "bg-white"} md:z-0 z-60`}
    >
      <h2 className="text-2xl font-bold mb-6 ">{role} Panel</h2>
      <nav className="space-y-3 text-lg">
        {sectionsByRole[role].map((s) => (
          <button
            key={s.key}
            onClick={() => {
              setSection(s.key);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 p-3 rounded-lg ${
              section === s.key
                ? "bg-blue-600 text-white"
                : darkMode
                ? "hover:bg-gray-700"
                : "hover:bg-gray-200"
            }`}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
