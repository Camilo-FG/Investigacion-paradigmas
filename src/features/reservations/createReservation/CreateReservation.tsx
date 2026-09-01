import { useState, useEffect, useMemo, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../../shared/components/Layout';
import { getRooms } from '../../rooms/getRooms/getRoomsApi';
import { createReservation } from './createReservationApi';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import type { Room } from '../../../shared/contracts/types';
import type { CreateReservationRequest } from './types';

export function CreateReservation() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<CreateReservationRequest>({
    roomId: '',
    guestName: '',
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
  });
  const [guestsStr, setGuestsStr] = useState('1');

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await getRooms();
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

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === form.roomId),
    [rooms, form.roomId],
  );

  const totalPrice = useMemo(() => {
    if (!selectedRoom || !form.checkInDate || !form.checkOutDate) return 0;
    const checkIn = new Date(form.checkInDate);
    const checkOut = new Date(form.checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights * selectedRoom.basePricePerNight : 0;
  }, [selectedRoom, form.checkInDate, form.checkOutDate]);

  const handleChange = (field: keyof CreateReservationRequest, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.roomId) {
      setError('Selecciona una habitación');
      return;
    }
    if (!form.guestName.trim()) {
      setError('El nombre del huésped es requerido');
      return;
    }
    if (!form.checkInDate || !form.checkOutDate) {
      setError('Las fechas son requeridas');
      return;
    }
    if (new Date(form.checkOutDate) <= new Date(form.checkInDate)) {
      setError('La fecha de check-out debe ser posterior al check-in');
      return;
    }
    const guests = parseInt(guestsStr, 10);
    if (isNaN(guests) || guests < 1) {
      setError('El número de huéspedes debe ser al menos 1');
      return;
    }
    if (selectedRoom && guests > selectedRoom.capacity) {
      setError(`La capacidad máxima es ${selectedRoom.capacity}`);
      return;
    }
    if (totalPrice <= 0) {
      setError('El precio calculado debe ser mayor a 0');
      return;
    }

    setSubmitting(true);
    try {
      await createReservation({
        ...form,
        guests,
        checkInDate: new Date(form.checkInDate).toISOString(),
        checkOutDate: new Date(form.checkOutDate).toISOString(),
      });
      navigate('/dashboard');
    } catch (err: unknown) {
      let message = 'Error al crear reservación';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        if (axiosErr.response?.data?.error) message = axiosErr.response.data.error;
      }
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <div className="page-container">
        <h1>Crear Reservación</h1>
        {error && <ErrorMessage message={error} />}
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-group">
            <label>Habitación</label>
            <select
              value={form.roomId}
              onChange={(e) => handleChange('roomId', e.target.value)}
              required
            >
              <option value="">Seleccionar habitación</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.number} - {room.type} (Piso {room.floor}, ${room.basePricePerNight}/noche)
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Nombre del Huésped</label>
            <input
              type="text"
              value={form.guestName}
              onChange={(e) => handleChange('guestName', e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Fecha Check-In</label>
              <input
                type="date"
                value={form.checkInDate}
                onChange={(e) => handleChange('checkInDate', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Fecha Check-Out</label>
              <input
                type="date"
                value={form.checkOutDate}
                onChange={(e) => handleChange('checkOutDate', e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Número de Huéspedes</label>
            <input
              type="number"
              value={guestsStr}
              onChange={(e) => setGuestsStr(e.target.value)}
              min="1"
              max={selectedRoom?.capacity ?? 10}
              required
            />
            {selectedRoom && (
              <small className="form-hint">Capacidad máxima: {selectedRoom.capacity}</small>
            )}
          </div>
          {selectedRoom && totalPrice > 0 && (
            <div className="price-summary">
              <p><strong>Precio por noche:</strong> ${selectedRoom.basePricePerNight}</p>
              <p><strong>Noches:</strong> {Math.ceil((new Date(form.checkOutDate).getTime() - new Date(form.checkInDate).getTime()) / (1000 * 60 * 60 * 24))}</p>
              <p className="total-price"><strong>Total:</strong> ${totalPrice.toFixed(2)}</p>
            </div>
          )}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creando...' : 'Crear Reservación'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
