import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from './common/LoadingSpinner';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!user?.isActive) {
    return (
      <div className="page-container">
        <div className="alert alert-error">
          <strong>403 Forbidden</strong> — Tu cuenta está desactivada. Contacta al administrador.
        </div>
      </div>
    );
  }

  if (user.role === 'Subscription_L1') {
    const expiration = new Date(user.subscriptionExpirationDate);
    if (expiration < new Date()) {
      return (
        <div className="page-container">
          <div className="alert alert-error">
            <strong>403 Forbidden</strong> — Tu suscripción expiró el{' '}
            {expiration.toLocaleDateString()}. Renueva para continuar.
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
