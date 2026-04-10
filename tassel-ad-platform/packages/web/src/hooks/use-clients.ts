import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client.js';

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: () => apiClient.get('/clients'),
  });
}
