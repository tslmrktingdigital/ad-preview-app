'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api-client';

export function useAds(status?: string) {
  const params = status ? `?status=${status}` : '';
  return useQuery({
    queryKey: ['ads', status],
    queryFn: () => api.get<any[]>(`/ads${params}`),
  });
}

export function useAd(id: string) {
  return useQuery({
    queryKey: ['ads', id],
    queryFn: () => api.get<any>(`/ads/${id}`),
    enabled: !!id,
  });
}

export function useUpdateAd(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.put<any>(`/ads/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ads', id] });
      qc.invalidateQueries({ queryKey: ['ads'] });
    },
  });
}

export function useApproveAd(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<any>(`/ads/${id}/approve`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ads', id] });
      qc.invalidateQueries({ queryKey: ['ads'] });
    },
  });
}

export function useRejectAd(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reason: string) => api.post<any>(`/ads/${id}/reject`, { reason }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ads', id] });
      qc.invalidateQueries({ queryKey: ['ads'] });
    },
  });
}

export function usePublishAd(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<any>(`/ads/${id}/publish`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ads', id] }),
  });
}
