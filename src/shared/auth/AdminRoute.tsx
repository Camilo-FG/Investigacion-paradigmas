import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading, isAuthenticated } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="page-container">
          <h1>Acceso denegado</h1>
          <div className="alert alert-error">
            <strong>403 Forbidden</strong> — Esta sección requiere rol Administrador.
            Inicia sesión con una cuenta Admin para continuar.
          </div>
          <Link to="/dashboard" className="btn btn-secondary">
            Volver al dashboard
          </Link>
        </div>
      </Layout>
    );
  }

  return <>{children}</>;
}
