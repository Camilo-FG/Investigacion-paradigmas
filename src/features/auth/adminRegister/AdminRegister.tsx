import { useState, type FormEvent } from 'react';
import { Layout } from '../../../shared/components/Layout';
import { useAuth } from '../useAuth';
import { validatePassword } from '../passwordPolicy';

export function AdminRegister() {
  const { adminRegister } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await adminRegister(email, password);
      setSuccess(`Administrador ${email} creado correctamente.`);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      let message = 'Error al crear administrador';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string }; status?: number } };
        if (axiosErr.response?.status === 401) {
          message = 'Debes iniciar sesión como Admin para crear otro administrador.';
        } else if (axiosErr.response?.status === 403) {
          message = 'Solo un Admin puede crear otro Admin.';
        } else if (axiosErr.response?.data?.error) {
          message = axiosErr.response.data.error;
        }
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page-container">
        <h1>Crear Administrador</h1>
        <p className="form-hint" style={{ marginBottom: '20px' }}>
          Registra un nuevo usuario con rol Admin. Requiere sesión de administrador.
        </p>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label>Confirmar contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Admin'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
