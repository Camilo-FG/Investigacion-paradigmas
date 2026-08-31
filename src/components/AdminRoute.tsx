import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from './common/LoadingSpinner';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}
