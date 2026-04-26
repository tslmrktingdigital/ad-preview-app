import type { ApiResponse, FoodTruck, ScheduleEntry } from '@wft/shared';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const json: ApiResponse<T> = await res.json();
  if (!json.success) throw new Error(json.error ?? 'Unknown API error');
  return json.data!;
}

export type TruckWithTodaySchedule = FoodTruck & {
  schedule: ScheduleEntry[];
  posts: Array<{ id: string; platform: string; text: string; postUrl: string; imageUrl?: string }>;
};

export function getTrucks(): Promise<TruckWithTodaySchedule[]> {
  return apiFetch<TruckWithTodaySchedule[]>('/api/trucks');
}

export function getTruck(slug: string): Promise<TruckWithTodaySchedule> {
  return apiFetch<TruckWithTodaySchedule>(`/api/trucks/${slug}`);
}

export function getTodaySchedule(): Promise<Array<ScheduleEntry & { truck: FoodTruck }>> {
  return apiFetch<Array<ScheduleEntry & { truck: FoodTruck }>>('/api/schedule');
}

export function getWeekSchedule(): Promise<Record<string, Array<ScheduleEntry & { truck: FoodTruck }>>> {
  return apiFetch<Record<string, Array<ScheduleEntry & { truck: FoodTruck }>>>('/api/schedule/week');
}
