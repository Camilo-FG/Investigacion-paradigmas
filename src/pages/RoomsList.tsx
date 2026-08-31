import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { roomsService } from '../api/rooms';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import type { Room } from '../types';

export function RoomsList() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await roomsService.getRooms();
        setRooms(data);
      } catch (err: unknown) {
        let message = 'Error al cargar habitaciones';
        if (err && typeof err === 'object' && 'response' in err) {
          const axiosErr = err as { response?: { data?: { error?: string } } };
          if (axiosErr.response?.data?.error) message = axiosErr.response.data.error;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    loadRooms();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1>Habitaciones</h1>
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => navigate('/rooms/create')}>
              Crear Habitación
            </button>
          )}
        </div>
        {error && <ErrorMessage message={error} />}
        <div className="rooms-grid">
          {rooms.map((room) => (
            <div key={room.id} className="room-card">
              <div className="room-header">
                <h3>Habitación {room.number}</h3>
                <span className="room-type">{room.type}</span>
              </div>
              <div className="room-details">
                <p><strong>Piso:</strong> {room.floor}</p>
                <p><strong>Capacidad:</strong> {room.capacity} personas</p>
                <p><strong>Precio:</strong> ${room.basePricePerNight} / noche</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
