import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../../shared/components/Layout';
import { createRoom } from './createRoomApi';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import type { RoomType } from '../../../shared/contracts/types';
import type { CreateRoomRequest } from './types';

export function CreateRoom() {
  const navigate = useNavigate();
  const [form, setForm] = useState<CreateRoomRequest>({
    number: '',
    type: 'Single',
    floor: 1,
    capacity: 1,
    basePricePerNight: 0,
  });
  const [floorStr, setFloorStr] = useState('1');
  const [capacityStr, setCapacityStr] = useState('1');
  const [priceStr, setPriceStr] = useState('0');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.number.trim()) {
      setError('El número de habitación es requerido');
      return;
    }
    const floor = parseInt(floorStr, 10);
    const capacity = parseInt(capacityStr, 10);
    const basePricePerNight = parseFloat(priceStr);
    if (isNaN(floor) || floor < 1) {
      setError('El piso debe ser un número mayor a 0');
      return;
    }
    if (isNaN(capacity) || capacity < 1) {
      setError('La capacidad debe ser un número mayor a 0');
      return;
    }
    if (isNaN(basePricePerNight) || basePricePerNight <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }

    setLoading(true);
    try {
      await createRoom({
        number: form.number,
        type: form.type,
        floor,
        capacity,
        basePricePerNight,
      });
      navigate('/rooms');
    } catch (err: unknown) {
      let message = 'Error al crear habitación';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        if (axiosErr.response?.data?.error) message = axiosErr.response.data.error;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page-container">
        <h1>Crear Habitación</h1>
        {error && <ErrorMessage message={error} />}
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-group">
            <label>Número</label>
            <input
              type="text"
              value={form.number}
              onChange={(e) => setForm((prev) => ({ ...prev, number: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label>Tipo</label>
            <select
              value={form.type}
              onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as RoomType }))}
            >
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Suite">Suite</option>
            </select>
          </div>
          <div className="form-group">
            <label>Piso</label>
            <input
              type="number"
              value={floorStr}
              onChange={(e) => setFloorStr(e.target.value)}
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Capacidad</label>
            <input
              type="number"
              value={capacityStr}
              onChange={(e) => setCapacityStr(e.target.value)}
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Precio por Noche ($)</label>
            <input
              type="number"
              value={priceStr}
              onChange={(e) => setPriceStr(e.target.value)}
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Habitación'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/rooms')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
