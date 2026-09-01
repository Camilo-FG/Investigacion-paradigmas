import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/useAuth';
import { Layout } from '../../../shared/components/Layout';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';

export function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) setLoading(false);
  }, [user]);

  if (loading) return <LoadingSpinner />;
  if (!user) return <ErrorMessage message="No se pudo cargar la información del usuario" />;

  const isExpired = user.role === 'Subscription_L1' && new Date(user.subscriptionExpirationDate) < new Date();

  return (
    <Layout>
      <div className="page-container">
        <h1>Dashboard</h1>
        <div className="dashboard-card">
          <h2>Bienvenido, {user.email}</h2>
          <div className="dashboard-info">
            <div className="info-item">
              <label>Rol:</label>
              <span className={`role-badge ${user.role === 'Admin' ? 'role-admin' : 'role-sub'}`}>
                {user.role === 'Admin' ? 'Administrador' : 'Suscriptor Nivel 1'}
              </span>
            </div>
            <div className="info-item">
              <label>Estado:</label>
              <span className={user.isActive ? 'status-active' : 'status-inactive'}>
                {user.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            {user.role === 'Subscription_L1' && (
              <div className="info-item">
                <label>Suscripción:</label>
                <span className={isExpired ? 'status-inactive' : 'status-active'}>
                  {isExpired
                    ? `Expirada el ${new Date(user.subscriptionExpirationDate).toLocaleDateString()}`
                    : `Válida hasta el ${new Date(user.subscriptionExpirationDate).toLocaleDateString()}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
