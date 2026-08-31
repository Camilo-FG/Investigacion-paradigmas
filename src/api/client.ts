import axios from 'axios';
import { tokenUtils } from '../utils/token';
import { apiErrorBus } from './errorBus';

const API_BASE_URL = 'http://localhost:5018';

const PUBLIC_AUTH_PATHS = ['/login', '/register', '/refresh', '/admin/register'];

function isPublicAuthRequest(url: string | undefined): boolean {
  if (!url) return false;
  return PUBLIC_AUTH_PATHS.some((path) => url.includes(path));
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config) => {
    const token = tokenUtils.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403) {
      const apiMessage =
        typeof error.response?.data?.error === 'string'
          ? error.response.data.error
          : 'No tienes permiso para realizar esta acción.';
      apiErrorBus.publish(apiMessage);
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401
      && !originalRequest._retry
      && !isPublicAuthRequest(originalRequest.url)
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenUtils.getRefreshToken();
      if (!refreshToken) {
        tokenUtils.clearTokens();
        window.location.href = '/login';
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${API_BASE_URL}/refresh`, {
          refreshToken,
        });
        tokenUtils.setTokens(data.accessToken, data.refreshToken);
        apiClient.defaults.headers.common.Authorization =
          `Bearer ${data.accessToken}`;
        processQueue(null, data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenUtils.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
