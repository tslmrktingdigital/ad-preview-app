'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api-client';

export function useCampaigns(clientId?: string) {
  const params = clientId ? `?clientId=${clientId}` : '';
  return useQuery({
    queryKey: ['campaigns', clientId],
    queryFn: () => api.get<any[]>(`/campaigns${params}`),
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ['campaigns', id],
    queryFn: () => api.get<any>(`/campaigns/${id}`),
    enabled: !!id,
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post<any>('/campaigns', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['campaigns'] }),
  });
}

export function useTriggerGenerate(campaignId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<{ jobId: string }>(`/campaigns/${campaignId}/generate`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['campaigns', campaignId] }),
  });
}

export function useGenerateStatus(campaignId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['generate-status', campaignId],
    queryFn: () => api.get<any>(`/campaigns/${campaignId}/generate-status`),
    enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'active' || status === 'waiting' ? 2000 : false;
    },
  });
}

export function useCampaignAds(campaignId: string) {
  return useQuery({
    queryKey: ['campaign-ads', campaignId],
    queryFn: () => api.get<any[]>(`/campaigns/${campaignId}/ads`),
    enabled: !!campaignId,
  });
}

export function useShareCampaignPreview(campaignId: string) {
  return useMutation({
    mutationFn: () => api.post<{ url: string }>(`/campaigns/${campaignId}/preview-link`),
  });
}
