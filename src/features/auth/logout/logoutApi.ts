import apiClient from '../../../shared/api/client';
import { tokenUtils } from '../../../shared/auth/token';

export async function logout(): Promise<void> {
  const refreshToken = tokenUtils.getRefreshToken();
  if (refreshToken) {
    await apiClient.post('/logout', { refreshToken });
  }
}
