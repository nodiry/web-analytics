import { apiGet } from './client';
import type { MetricData } from '@/components/types';

interface MetricsResponse { metrics: MetricData[] }

export const metricsApi = {
  fetch: (userId: string, unique_key: string, periodNum: number) =>
    apiGet<MetricsResponse>(`metric/${userId}/${unique_key}/${periodNum}`),
};
