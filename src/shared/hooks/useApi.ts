import { useState, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<T>): Promise<T | null> => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await apiCall();
      setState({ data, loading: false, error: null });
      return data;
    } catch (err: unknown) {
      let message = 'Error de conexión con el servidor';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string }; status?: number } };
        if (axiosErr.response?.data?.error) {
          message = axiosErr.response.data.error;
        } else if (axiosErr.response?.status === 401) {
          message = 'Sesión expirada. Inicia sesión de nuevo.';
        } else if (axiosErr.response?.status === 403) {
          message = 'No tienes permisos para realizar esta acción.';
        }
      }
      setState({ data: null, loading: false, error: message });
      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return { ...state, execute, clearError };
}
