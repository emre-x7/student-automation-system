import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Students from "./pages/students/Students";
import Teachers from "./pages/teachers/Teachers";
import Courses from "./pages/courses/Courses";
import Grades from "./pages/grades/Grades";
import MyGrades from "./pages/my-grades/MyGrades";
import StudentProfile from "./pages/students/StudentProfile";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (Array.isArray(requiredRole)) {
    if (!requiredRole.includes(user.role)) return <Navigate to="/dashboard" />;
  } else if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* ÖĞRENCİLER - Admin VE Teacher */}
            <Route
              path="/students"
              element={
                <ProtectedRoute requiredRole={["Admin", "Teacher"]}>
                  <Students />
                </ProtectedRoute>
              }
            />

            {/* ÖĞRETMENLER - Sadece Admin */}
            <Route
              path="/teachers"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <Teachers />
                </ProtectedRoute>
              }
            />

            {/* DERSLER - Admin VE Teacher */}
            <Route
              path="/courses"
              element={
                <ProtectedRoute requiredRole={["Admin", "Teacher"]}>
                  <Courses />
                </ProtectedRoute>
              }
            />

            {/* NOT İŞLEMLERİ - Sadece Teacher */}
            <Route
              path="/grades"
              element={
                <ProtectedRoute requiredRole="Teacher">
                  <Grades />
                </ProtectedRoute>
              }
            />

            {/* NOTLARIM - Sadece Student */}
            <Route
              path="/my-grades"
              element={
                <ProtectedRoute requiredRole="Student">
                  <MyGrades />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student-profile"
              element={
                <ProtectedRoute requiredRole="Student">
                  <StudentProfile />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
