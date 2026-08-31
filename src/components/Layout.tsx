import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'nav-link active' : 'nav-link';

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="app-layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/dashboard">Hotel System</Link>
        </div>
        <div className="navbar-links">
          <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
          <Link to="/rooms" className={isActive('/rooms')}>Habitaciones</Link>
          <Link to="/reservations/create" className={isActive('/reservations/create')}>Crear Reservación</Link>
          {isAdmin && (
            <>
              <Link to="/admin-panel" className={isActive('/admin-panel')}>Panel Admin</Link>
              <Link to="/reservations" className={isActive('/reservations')}>Reservaciones</Link>
            </>
          )}
        </div>
        <div className="navbar-user">
          <span>{user?.email}</span>
          <span className="role-badge">{user?.role === 'Admin' ? 'Admin' : 'Suscriptor'}</span>
          <button onClick={handleLogout} className="btn btn-logout">Salir</button>
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
}
