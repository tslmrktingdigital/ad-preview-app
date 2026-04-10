'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api-client';

export function useClients() {
  return useQuery({ queryKey: ['clients'], queryFn: () => api.get<any[]>('/clients') });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => api.get<any>(`/clients/${id}`),
    enabled: !!id,
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; websiteUrl: string }) => api.post<any>('/clients', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useTriggerScan(clientId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<{ jobId: string }>(`/clients/${clientId}/scan`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients', clientId] }),
  });
}

export function useScanStatus(clientId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['scan-status', clientId],
    queryFn: () => api.get<any>(`/clients/${clientId}/scan-status`),
    enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'active' || status === 'waiting' ? 2000 : false;
    },
  });
}
