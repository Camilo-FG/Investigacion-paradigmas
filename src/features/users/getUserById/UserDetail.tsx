import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../../shared/components/Layout';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import { getUserById } from './getUserByIdApi';
import type { User } from '../../../shared/contracts/types';

export function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('Id de usuario inválido');
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getUserById(id);
        setUser(data);
      } catch (err: unknown) {
        let message = 'Error al cargar el usuario';
        if (err && typeof err === 'object' && 'response' in err) {
          const axiosErr = err as { response?: { data?: { error?: string }; status?: number } };
          if (axiosErr.response?.status === 404) {
            message = 'Usuario no encontrado';
          } else if (axiosErr.response?.data?.error) {
            message = axiosErr.response.data.error;
          }
        }
        setError(message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  const isExpired =
    user?.role === 'Subscription_L1' && new Date(user.subscriptionExpirationDate) < new Date();

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1>Detalle de usuario</h1>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin-panel')}>
            Volver al panel
          </button>
        </div>
        {error && <ErrorMessage message={error} />}
        {user && (
          <div className="dashboard-card">
            <h2>{user.email}</h2>
            <div className="dashboard-info">
              <div className="info-item">
                <label>Id:</label>
                <span>{user.id}</span>
              </div>
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
        )}
      </div>
    </Layout>
  );
}
