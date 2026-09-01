import { useState, useEffect } from 'react';
import { Layout } from '../../../shared/components/Layout';
import { getReservations } from './getReservationsApi';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import type { Reservation } from '../../../shared/contracts/types';

export function ReservationsList() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const data = await getReservations();
        const sorted = data.sort(
          (a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime(),
        );
        setReservations(sorted);
      } catch (err: unknown) {
        let message = 'Error al cargar reservaciones';
        if (err && typeof err === 'object' && 'response' in err) {
          const axiosErr = err as { response?: { data?: { error?: string } } };
          if (axiosErr.response?.data?.error) message = axiosErr.response.data.error;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    loadReservations();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <div className="page-container">
        <h1>Reservaciones</h1>
        {error && <ErrorMessage message={error} />}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Huésped</th>
                <th>Habitación</th>
                <th>Tipo</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Huéspedes</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res.id}>
                  <td>{res.guestName}</td>
                  <td>{res.roomNumber} (Piso {res.roomFloor})</td>
                  <td>{res.roomType}</td>
                  <td>{new Date(res.checkInDate).toLocaleDateString()}</td>
                  <td>{new Date(res.checkOutDate).toLocaleDateString()}</td>
                  <td>{res.guests}</td>
                  <td>${res.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
