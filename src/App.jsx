import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import AdminLayout  from './components/AdminLayout';
import StudentLayout from './components/StudentLayout';

import AdminDashboard  from './pages/admin/Dashboard';
import AdminBooks      from './pages/admin/Books';
import AdminSessions   from './pages/admin/Sessions';
import AdminStudents   from './pages/admin/Students';
import AdminAttendance from './pages/admin/Attendance';

import StudentDashboard from './pages/student/Dashboard';
import Library          from './pages/student/Library';
import CampusTour       from './pages/student/CampusTour';
import StudentAttendance from './pages/student/Attendance';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-bg">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} /> : <Login />} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index   element={<AdminDashboard />} />
        <Route path="books"      element={<AdminBooks />} />
        <Route path="sessions"   element={<AdminSessions />} />
        <Route path="students"   element={<AdminStudents />} />
        <Route path="attendance" element={<AdminAttendance />} />
      </Route>

      {/* Student */}
      <Route path="/student" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
        <Route index   element={<StudentDashboard />} />
        <Route path="library"    element={<Library />} />
        <Route path="tour"       element={<CampusTour />} />
        <Route path="attendance" element={<StudentAttendance />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
