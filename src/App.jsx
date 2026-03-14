import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardHome from "./pages/DashboardHome";
import ProgramOfferings from "./pages/ProgramOfferings";
import SubjectOfferings from "./pages/SubjectOfferings";
import Students from "./pages/Students";
import Enrollment from "./pages/Enrollment";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={(
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        )}
      >
        <Route index element={<DashboardHome />} />
        <Route path="programs" element={<ProgramOfferings />} />
        <Route path="subjects" element={<SubjectOfferings />} />
        <Route path="courses" element={<Navigate to="/dashboard/subjects" replace />} />
        <Route path="students" element={<Students />} />
        <Route path="enrollment" element={<Enrollment />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
