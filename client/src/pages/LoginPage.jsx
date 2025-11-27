import React, { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { useDarkMode } from "../auth/DarkModeContext";

export default function LoginPage() {
  const { login } = useAuth();
  const { darkMode } = useDarkMode();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!email.trim() || !password.trim()) {
      alert("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
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
        className={`w-full max-w-md p-8 rounded-lg shadow-lg ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={`border p-2 rounded ${
              darkMode ? "bg-gray-700 border-gray-600" : ""
            }`}
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-400 hover:underline font-semibold"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
