import { useEffect, useState } from 'react';
import { apiErrorBus } from '../api/errorBus';

export function ApiErrorBanner() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => apiErrorBus.subscribe(setMessage), []);

  if (!message) return null;

  return (
    <div className="api-error-banner" role="alert">
      <span>
        <strong>403 — Acceso denegado:</strong> {message}
      </span>
      <button
        type="button"
        className="api-error-banner-dismiss"
        onClick={() => setMessage(null)}
        aria-label="Cerrar"
      >
        ×
      </button>
    </div>
  );
}
