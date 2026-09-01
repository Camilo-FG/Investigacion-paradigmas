import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../../shared/components/Layout';
import { useAuth } from '../../auth/useAuth';
import { getUsers } from '../getUsers/getUsersApi';
import { updateUserStatus } from '../updateUserStatus/updateUserStatusApi';
import { updateSubscriptionExpiration } from '../updateSubscriptionExpiration/updateSubscriptionExpirationApi';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import type { User } from '../../../shared/contracts/types';

export function AdminPanel() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newExpiration, setNewExpiration] = useState('');

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err: unknown) {
      let message = 'Error al cargar usuarios';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        if (axiosErr.response?.data?.error) message = axiosErr.response.data.error;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    if (currentUser?.id === id) {
      setError('No puedes desactivarte a ti mismo');
      return;
    }

    const adminCount = users.filter((u) => u.role === 'Admin').length;
    if (currentStatus && adminCount <= 1 && users.find((u) => u.id === id)?.role === 'Admin') {
      setError('No puedes desactivar al último administrador');
      return;
    }

    try {
      await updateUserStatus(id, { isActive: !currentStatus });
      await loadUsers();
    } catch (err: unknown) {
      let message = 'Error al actualizar usuario';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        if (axiosErr.response?.data?.error) message = axiosErr.response.data.error;
      }
      setError(message);
    }
  };

  const handleUpdateExpiration = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingId || !newExpiration) return;

    try {
      const utcDate = new Date(newExpiration).toISOString();
      await updateSubscriptionExpiration(editingId, {
        subscriptionExpirationDate: utcDate,
      });
      setEditingId(null);
      setNewExpiration('');
      await loadUsers();
    } catch (err: unknown) {
      let message = 'Error al actualizar expiración';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        if (axiosErr.response?.data?.error) message = axiosErr.response.data.error;
      }
      setError(message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <div className="page-container">
        <h1>Panel de Administración</h1>
        {error && <ErrorMessage message={error} />}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Rol</th>
                <th>Activo</th>
                <th>Expiración Suscripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-badge ${u.role === 'Admin' ? 'role-admin' : 'role-sub'}`}>
                      {u.role === 'Admin' ? 'Admin' : 'Suscriptor'}
                    </span>
                  </td>
                  <td>
                    <span className={u.isActive ? 'status-active' : 'status-inactive'}>
                      {u.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    {u.role === 'Subscription_L1'
                      ? new Date(u.subscriptionExpirationDate).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => navigate(`/admin-panel/users/${u.id}`)}
                    >
                      Ver
                    </button>
                    <button
                      className={`btn btn-sm ${u.isActive ? 'btn-warning' : 'btn-success'}`}
                      onClick={() => handleToggleStatus(u.id, u.isActive)}
                      disabled={currentUser?.id === u.id}
                    >
                      {u.isActive ? 'Desactivar' : 'Activar'}
                    </button>
                    {u.role === 'Subscription_L1' && (
                      <>
                        {editingId === u.id ? (
                          <form onSubmit={handleUpdateExpiration} className="inline-form">
                            <input
                              type="date"
                              value={newExpiration}
                              onChange={(e) => setNewExpiration(e.target.value)}
                              required
                            />
                            <button type="submit" className="btn btn-sm btn-primary">Guardar</button>
                            <button type="button" className="btn btn-sm btn-secondary" onClick={() => setEditingId(null)}>
                              Cancelar
                            </button>
                          </form>
                        ) : (
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => {
                              setEditingId(u.id);
                              setNewExpiration(u.subscriptionExpirationDate.split('T')[0]);
                            }}
                          >
                            Expiración
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
