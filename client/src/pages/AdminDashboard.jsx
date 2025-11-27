import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import { FiMenu, FiX } from "react-icons/fi";
import { useDarkMode } from "../auth/DarkModeContext";

export default function AdminDashboard() {
  const { darkMode } = useDarkMode();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [section, setSection] = useState("create");

  const [users, setUsers] = useState([]);
  const [readers, setReaders] = useState([]);
  const [approvedArticles, setApprovedArticles] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Editor",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("Editor");

  const [createLoading, setCreateLoading] = useState(false);
  const [saveRoleLoading, setSaveRoleLoading] = useState(false);

  async function load() {
    try {
      const res = await API.get("/users");
      setUsers(res.data.filter((u) => u.role !== "Reader")); 
      setReaders(res.data.filter((u) => u.role === "Reader"));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }

    try {
      const res2 = await API.get("/users/articles/approved");
      setApprovedArticles(res2.data);
    } catch {}
  }

  useEffect(() => {
    load();
  }, []);

   const createUser = async (e) => {
    e.preventDefault();

    // Validation
    if (form.password.length < 6) {
      return alert("Password must be at least 6 characters");
    }
    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match");
    }

    if (createLoading) return; // prevent double click
    setCreateLoading(true);

    try {
      await API.post("/users/create", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      alert("User created successfully!");
      setForm({ name: "", email: "", password: "", confirmPassword: "", role: "Editor" });
      load();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }

    setCreateLoading(false);
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setModalOpen(true);
  };

  const saveRoleChange = async () => {
    if (saveRoleLoading) return; // prevent double click
    setSaveRoleLoading(true);

    const ok = window.confirm(`Are you sure to change role to ${newRole}?`);
    if (!ok) {
      setSaveRoleLoading(false);
      return;
    } 

    try {
      await API.post("/users/role", { userId: selectedUser._id, role: newRole });
      alert("Role updated successfully!");
      setModalOpen(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
    
    setSaveRoleLoading(false);

  };

  return (
    <div
      className={`min-h-screen flex transition duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Sidebar
        role="Admin"
        darkMode={darkMode}
        section={section}
        setSection={setSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="flex-1 p-6 md:p-10 relative">

        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className={`absolute top-4 right-4 p-2 rounded-md md:hidden ${
              darkMode ? "bg-gray-700" : "bg-white"
            }`}
          >
            <FiMenu size={24} />
          </button>
        )}

        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className={`fixed top-4 left-52 p-2 rounded-md md:hidden ${
              darkMode ? "bg-gray-700" : "bg-white"
            }`}
          >
            <FiX size={24} />
          </button>
        )}

        {section === "create" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Create Users</h1>

            <div
              className={`p-6 max-w-xl rounded shadow ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <form className="flex flex-col gap-4" onSubmit={createUser}>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full Name"
                  className="border p-2 rounded"
                />

                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email"
                  className="border p-2 rounded"
                />

                <input
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                    placeholder="Password (min 6 chars)"
                  type="password"
                  className="border p-2 rounded"
                />

                <input
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Confirm Password"
                  type="password"
                  className="border p-2 rounded"
                />

                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="border p-2 rounded"
                >
                  <option>Admin</option>
                  <option>Editor</option>
                  <option>Writer</option>
                </select>

                <button
                  type="submit"
                  disabled={createLoading}
                  className={`py-2 rounded text-white ${createLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600"}`}
                >
                  {createLoading ? "Creating…" : "Create User"}
                </button>
              </form>
            </div>
          </div>
        )}

        {section === "manage" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

            {users.map((u) => (
              <div
                key={u._id}
                className={`p-4 mb-3 rounded shadow flex justify-between items-center ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div>
                  <h3 className="font-semibold">{u.name}</h3>
                  <p className="text-gray-400 text-sm">{u.email}</p>
                  <p className="text-sm">Role: {u.role}</p>
                </div>

                <button
                  onClick={() => openRoleModal(u)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Change Role
                </button>
              </div>
            ))}
          </div>
        )}

        {section === "readers" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Readers</h1>

            {readers.length === 0 && <p>No Readers Found.</p>}

            {readers.map((r) => (
              <div
                key={r._id}
                className={`p-4 rounded shadow mb-3 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3 className="font-semibold">{r.name}</h3>
                <p className="text-gray-400">{r.email}</p>
              </div>
            ))}
          </div>
        )}

        {section === "approvedArticles" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Approved Articles</h1>

            {approvedArticles.map((a) => (
              <div
                key={a._id}
                className={`p-4 mb-3 rounded shadow ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h2 className="font-semibold text-xl">{a.title}</h2>

                <p className="text-gray-400">
                  Writer: {a.author?.name || "Unknown"}
                </p>

                <p className="text-green-400">
                  Approved By: {a.approvedBy?.name || "Unknown"}
                </p>
              </div>
            ))}
          </div>
        )}

        {modalOpen && (
          <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div
              className={`p-6 rounded shadow w-full max-w-md ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h2 className="text-xl font-bold mb-4">
                Change Role: {selectedUser?.name}
              </h2>

              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="border p-2 w-full rounded mb-4"
              >
                <option>Admin</option>
                <option>Editor</option>
                <option>Writer</option>
              </select>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1 rounded border"
                >
                  Cancel
                </button>

                <button
                  onClick={saveRoleChange}
                  disabled={saveRoleLoading}
                  className={`px-3 py-1 rounded text-white ${saveRoleLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600"}`}
                >
                  {saveRoleLoading ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
