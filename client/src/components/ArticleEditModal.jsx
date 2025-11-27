import React from "react";
import WriterArticleForm from "./WriterArticleForm";
import { FiX } from "react-icons/fi";

export default function ArticleEditModal({
  open,
  onClose,
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
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      
      <div
        className="absolute inset-0 bg-black/60 bg-opacity-50"
        onClick={onClose}
      ></div>

      <div
        className={`relative w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto rounded-lg shadow-xl p-6 transition
        ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:text-red-500 dark:hover:text-red-500"
        >
          <FiX className="m-4 hover:" size={20} />
        </button>
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
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
