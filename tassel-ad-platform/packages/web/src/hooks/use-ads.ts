import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client.js';

export function useAds(campaignId: string) {
  return useQuery({
    queryKey: ['ads', campaignId],
    queryFn: () => apiClient.get(`/campaigns/${campaignId}/ads`),
    enabled: !!campaignId,
  });
}
