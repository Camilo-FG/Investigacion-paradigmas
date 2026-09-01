import apiClient from '../../../shared/api/client';
import type { UpdateSubscriptionExpirationRequest } from './types';

export async function updateSubscriptionExpiration(
  id: string,
  data: UpdateSubscriptionExpirationRequest,
): Promise<void> {
  await apiClient.patch(`/users/${id}/subscription-expiration`, data);
}
