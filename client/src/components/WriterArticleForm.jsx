import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function WriterArticleForm({
  articleId,
  title,
  setTitle,
  body,
  setBody,
  assignedEditor,
  setAssignedEditor,
  editors,
  darkMode,
  onSubmit
}) {
  return (
    <div
      className={`p-6 rounded-xl shadow transition ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h2 className="text-3xl font-bold mb-6">
        {articleId ? "Edit Rejected Article" : "Create New Article"}
      </h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Article Title"
        className={`w-full p-3 rounded mb-4 border 
        ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
      />

      {!articleId && (
        <select
          value={assignedEditor}
          onChange={(e) => setAssignedEditor(e.target.value)}
          className={`w-full p-3 rounded mb-4 border 
          ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
        >
          <option value="">Select Editor</option>
          {editors.map((ed) => (
            <option key={ed._id} value={ed._id}>
              {ed.name} ({ed.email})
            </option>
          ))}
        </select>
      )}

      <ReactQuill value={body} onChange={setBody} className="h-60 mb-10" />

      <button
        onClick={onSubmit}
        className="mt-20 px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-500 transition"
      >
        {articleId ? "Resubmit" : "Submit Article"}
      </button>
    </div>
  );
}
