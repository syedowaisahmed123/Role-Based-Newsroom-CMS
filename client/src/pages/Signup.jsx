import React, { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { useDarkMode } from "../auth/DarkModeContext";

export default function Signup() {
  const { signup } = useAuth();
  const { darkMode } = useDarkMode();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [loading, setLoading] = useState(false); 

  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!name.trim()) {
      alert("Name is required.");
      return;
    }

    if (!email.includes("@")) {
      alert("Enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== cpassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await signup(name, email, password);
      alert("Account created successfully!");
      nav("/");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-center md:mt-0 md:min-h-screen mt-38 px-4 transition ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-lg shadow-lg transition ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Create Reader Account
        </h2>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className={`border p-2 rounded ${
              darkMode ? "bg-gray-700 border-gray-600" : ""
            }`}
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className={`border p-2 rounded ${
              darkMode ? "bg-gray-700 border-gray-600" : ""
            }`}
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 chars)"
            type="password"
            className={`border p-2 rounded ${
              darkMode ? "bg-gray-700 border-gray-600" : ""
            }`}
          />

          <input
            value={cpassword}
            onChange={(e) => setCPassword(e.target.value)}
            placeholder="Confirm Password"
            type="password"
            className={`border p-2 rounded ${
              darkMode ? "bg-gray-700 border-gray-600" : ""
            }`}
          />

          <button
            disabled={loading}
            className={`py-2 rounded text-white transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating..." : "Signup"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:underline font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
