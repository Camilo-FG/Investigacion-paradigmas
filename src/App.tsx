import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { AdminPanel } from './pages/AdminPanel';
import { RoomsList } from './pages/RoomsList';
import { CreateRoom } from './pages/CreateRoom';
import { ReservationsList } from './pages/ReservationsList';
import { CreateReservation } from './pages/CreateReservation';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-panel"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
          <Route
            path="/rooms"
            element={
              <ProtectedRoute>
                <RoomsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms/create"
            element={
              <AdminRoute>
                <CreateRoom />
              </AdminRoute>
            }
          />
          <Route
            path="/reservations"
            element={
              <AdminRoute>
                <ReservationsList />
              </AdminRoute>
            }
          />
          <Route
            path="/reservations/create"
            element={
              <ProtectedRoute>
                <CreateReservation />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
