import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/routing/ProtectedRoute';
import RoleRoute from './components/routing/RoleRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/StudentDashboard';
import AssignmentDetails from './pages/student/AssignmentDetails';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageAssignments from './pages/admin/ManageAssignments';
import CreateAssignment from './pages/admin/CreateAssignment';
import EditAssignment from './pages/admin/EditAssignment';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Student Routes */}
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
        <Route path="/student/assignments/:id" element={<AssignmentDetails />} />
      </Route>

      {/* Admin Routes */}
      <Route
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="admin">
              <DashboardLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/assignments" element={<ManageAssignments />} />
        <Route path="/admin/assignments/create" element={<CreateAssignment />} />
        <Route path="/admin/assignments/edit/:id" element={<EditAssignment />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
