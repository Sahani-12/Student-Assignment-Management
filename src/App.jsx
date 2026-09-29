import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/routing/ProtectedRoute';
import RoleRoute from './components/routing/RoleRoute';
import DashboardLayout from './components/layout/DashboardLayout';

import Login from './pages/Login';
import Register from './pages/Register';

// Professor pages
import ProfessorDashboard from './pages/professor/Dashboard';
import ProfessorCourseAssignments from './pages/professor/CourseAssignments';
import CreateAssignment from './pages/professor/CreateAssignment';
import EditAssignment from './pages/professor/EditAssignment';
import ProfessorAssignmentDetails from './pages/professor/AssignmentDetails';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCourseAssignments from './pages/student/CourseAssignments';
import StudentAssignmentDetails from './pages/student/AssignmentDetails';

export default function App() {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Student Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="student">
              <DashboardLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route
          path="/student/courses/:courseId/assignments"
          element={<StudentCourseAssignments />}
        />
        <Route
          path="/student/assignments/:id"
          element={<StudentAssignmentDetails />}
        />
      </Route>

      {/* Professor Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="professor">
              <DashboardLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
        <Route
          path="/professor/courses/:courseId/assignments"
          element={<ProfessorCourseAssignments />}
        />
        <Route
          path="/professor/assignments/create"
          element={<CreateAssignment />}
        />
        <Route
          path="/professor/assignments/edit/:id"
          element={<EditAssignment />}
        />
        <Route
          path="/professor/assignments/:id"
          element={<ProfessorAssignmentDetails />}
        />

        {/* Backwards-compatibility aliases for Task 1 admin routes */}
        <Route path="/admin/dashboard" element={<ProfessorDashboard />} />
        <Route
          path="/admin/assignments"
          element={<ProfessorDashboard />}
        />
        <Route
          path="/admin/assignments/create"
          element={<CreateAssignment />}
        />
        <Route
          path="/admin/assignments/edit/:id"
          element={<EditAssignment />}
        />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
