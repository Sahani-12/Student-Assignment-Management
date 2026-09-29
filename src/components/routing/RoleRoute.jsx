import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RoleRoute({ allowedRole, children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isProf = user.role === 'professor' || user.role === 'admin';
  const isStud = user.role === 'student';

  const isAllowed =
    (allowedRole === 'professor' || allowedRole === 'admin')
      ? isProf
      : allowedRole === 'student'
      ? isStud
      : user.role === allowedRole;

  if (!isAllowed) {
    return (
      <Navigate
        to={isProf ? '/professor/dashboard' : '/student/dashboard'}
        replace
      />
    );
  }

  return children;
}
