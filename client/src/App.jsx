import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import Signup from './pages/Signup';
import ArticleView from './pages/ArticleView';
import WriterDashboard from './pages/WriterDashboard';
import EditorDashboard from './pages/EditorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Bookmarks from './pages/Bookmarks';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-6 mt-28 md:mt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<ArticleView />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
          <Route path="/writer" element={<RoleProtectedRoute allowedRoles={['Writer','Admin']}><WriterDashboard /></RoleProtectedRoute>} />
          <Route path="/editor" element={<RoleProtectedRoute allowedRoles={['Editor','Admin']}><EditorDashboard /></RoleProtectedRoute>} />
          <Route path="/admin" element={<RoleProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></RoleProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}
