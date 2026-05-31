import { useState } from 'react';
import { RotateCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useTranslation } from '@/i18n';
import { metricsApi } from '@/api/metrics';

interface Props { unique_key: string }

export default function RefreshMetrics({ unique_key }: Props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  })();

  const handleRefresh = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      ['day', 'week', 'month', 'all'].forEach((p) =>
        localStorage.removeItem(`metrics_${unique_key}_${p}`),
      );
      const { metrics } = await metricsApi.fetch(user._id, unique_key, 3);
      const now = Date.now();
      const day  = metrics.filter((m) => new Date(m.timestamp).getTime() >= now - 864e5);
      const week = metrics.filter((m) => new Date(m.timestamp).getTime() >= now - 6048e5);
      localStorage.setItem(`metrics_${unique_key}_month`, JSON.stringify(metrics));
      localStorage.setItem(`metrics_${unique_key}_week`,  JSON.stringify(week));
      localStorage.setItem(`metrics_${unique_key}_day`,   JSON.stringify(day));
      toast.success('Metrics refreshed');
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || 'Refresh failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleRefresh} disabled={loading}>
            {loading
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <RotateCw className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('refreshmetric')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
