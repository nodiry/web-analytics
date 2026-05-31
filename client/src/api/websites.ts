import { apiPost, apiPut, apiDelete } from './client';
import type { Website } from '@/components/types';

interface WebsiteResponse { website: Website }

export const websiteApi = {
  create: (devId: string, url: string, desc: string) =>
    apiPost<WebsiteResponse>('web/', { dev: devId, url, desc }),

  update: (unique_key: string, url: string, desc: string) =>
    apiPut<WebsiteResponse>('web/', { unique_key, url, desc }),

  renew: (unique_key: string) =>
    fetch('https://was.glasscube.io/web/renew', {
      method: 'PUT',
      credentials: 'include',
      body: unique_key,
    }).then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to update');
      return data as WebsiteResponse;
    }),

  delete: (unique_key: string) =>
    apiDelete<void>('web/', { unique_key }),
};
