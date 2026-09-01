import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { ProtectedRoute } from './shared/auth/ProtectedRoute';
import { AdminRoute } from './shared/auth/AdminRoute';
import { ApiErrorBanner } from './shared/components/ApiErrorBanner';
import { Login } from './features/auth/login/Login';
import { Register } from './features/auth/register/Register';
import { Dashboard } from './features/users/getMe/Dashboard';
import { AdminPanel } from './features/users/adminPanel/AdminPanel';
import { UserDetail } from './features/users/getUserById/UserDetail';
import { RoomsList } from './features/rooms/getRooms/RoomsList';
import { CreateRoom } from './features/rooms/createRoom/CreateRoom';
import { ReservationsList } from './features/reservations/getReservations/ReservationsList';
import { CreateReservation } from './features/reservations/createReservation/CreateReservation';
import { AdminRegister } from './features/auth/adminRegister/AdminRegister';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ApiErrorBanner />
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
            path="/admin-panel/users/:id"
            element={
              <AdminRoute>
                <UserDetail />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/register"
            element={
              <AdminRoute>
                <AdminRegister />
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
