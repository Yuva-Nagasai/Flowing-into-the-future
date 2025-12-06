import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/academy/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/academy/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
