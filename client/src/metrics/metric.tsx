import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { Toaster } from '@/components/ui/sonner';
import VisitsChart from '@/components/visitChart';
import DeviceStatsChart from '@/components/devStatsChart';
import ReferrersChart from '@/components/referrers';
import AvgLoadTimeChart from '@/components/avgLoadTime';
import PagesChart from '@/components/pageChart';
import BounceRateChart from '@/components/bounceRate';
import SessionDurationChart from '@/components/sessionChart';
import GeoDistro from '@/components/geoDistro';
import Info from '@/components/info';
import UpdateWebsiteDetails from '@/components/updatewebsite';
import RefreshMetrics from '@/components/refresh';
import CodeGuide from '@/components/code';
import DeleteWebsite from '@/components/delete';
import { StatCard } from '@/components/webcard';
import Loading from '@/components/Loading';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useTranslation } from '@/i18n';
import { metricsApi } from '@/api/metrics';
import type { MetricData, Website } from '@/components/types';
import { ArrowUpRight } from 'lucide-react';

const PERIOD_MAP: Record<string, string> = {
  '1': 'day',
  '2': 'week',
  '3': 'month',
  '4': 'all',
};

function fSD(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function extractPeriods(allData: MetricData[], uniqueKey: string) {
  const now = Date.now();
  const day  = allData.filter((m) => new Date(m.timestamp).getTime() >= now - 864e5);
  const week = allData.filter((m) => new Date(m.timestamp).getTime() >= now - 6048e5);
  localStorage.setItem(`metrics_${uniqueKey}_day`,   JSON.stringify(day));
  localStorage.setItem(`metrics_${uniqueKey}_week`,  JSON.stringify(week));
  localStorage.setItem(`metrics_${uniqueKey}_month`, JSON.stringify(allData));
}

export default function Metric() {
  const { id, period } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [metrics, setMetrics]   = useState<MetricData[]>([]);
  const [website, setWebsite]   = useState<Website | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const loadMetrics = async (periodKey: string) => {
    const user     = JSON.parse(localStorage.getItem('user') || '{}');
    const websites: Website[] = JSON.parse(localStorage.getItem('web') || '[]');

    if (!user._id || !id) { navigate('/'); return; }

    const matched = websites.find((w) => w.unique_key === id);
    if (matched) setWebsite(matched);

    const cached = localStorage.getItem(`metrics_${id}_${periodKey}`);
    if (cached) {
      setMetrics(JSON.parse(cached));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const periodNum = periodKey === 'all' ? 4 : 3;
      const { metrics: data } = await metricsApi.fetch(user._id, id, periodNum);

      if (periodKey === 'all') localStorage.setItem(`metrics_${id}_all`, JSON.stringify(data));
      else extractPeriods(data, id);

      setMetrics(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const key = period ? PERIOD_MAP[period] ?? 'day' : 'day';
    loadMetrics(key);
  }, [id, period]);

  const handlePeriodChange = (val: string) => {
    if (val) navigate(`/metrics/${id}/${val}`);
  };

  if (loading) return <><NavBar /><Loading /></>;
  if (error)   return <div className="min-h-screen flex items-center justify-center text-destructive">{error}</div>;

  const periodLabel = [
    { v: '1', label: t('day') },
    { v: '2', label: t('week') },
    { v: '3', label: t('month') },
    { v: '4', label: t('all') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="max-w-7xl mx-auto px-4 pt-20 pb-16 space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3 min-w-0">
            <a
              href={website?.url?.startsWith('http') ? website.url : `https://${website?.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-bold hover:text-primary transition-colors flex items-center gap-1.5 truncate"
            >
              {website?.url?.replace(/^https?:\/\//, '')}
              <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </a>
            {website && (
              <Info
                date={website.created_at}
                url={website.url}
                desc={website.desc ?? ''}
              />
            )}
          </div>

          {/* Action toolbar */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {website?.unique_key && <CodeGuide unique_key={website.unique_key} />}
            {website?.unique_key && <RefreshMetrics unique_key={website.unique_key} />}
            {website && <UpdateWebsiteDetails website={website} />}
            {website?.unique_key && <DeleteWebsite unique_key={website.unique_key} />}
          </div>
        </div>

        {/* Period selector */}
        <div>
          <ToggleGroup
            type="single"
            value={period ?? '1'}
            onValueChange={handlePeriodChange}
            className="h-9"
          >
            {periodLabel.map(({ v, label }) => (
              <ToggleGroupItem key={v} value={v} variant="outline" className="text-xs px-3">
                {label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {/* Stat cards */}
        {website && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard title={t('totalvisits')}  value={website.stats.total_visits.toLocaleString()} />
            <StatCard title={t('uniquevisits')} value={website.stats.unique_visitors.toLocaleString()} />
            <StatCard title={t('bouncerate')}   value={`${website.stats.bounce_rate.toFixed(1)}%`} />
            <StatCard title={t('avgses')}        value={fSD(website.stats.avg_session_duration)} />
          </div>
        )}

        {/* Charts */}
        {metrics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VisitsChart metrics={metrics} />
            <DeviceStatsChart metrics={metrics} />
            <BounceRateChart metrics={metrics} />
            <SessionDurationChart metrics={metrics} />
            <AvgLoadTimeChart metrics={metrics} />
            <GeoDistro metrics={metrics} />
            <PagesChart metrics={metrics} />
            <ReferrersChart metrics={metrics} />
          </div>
        ) : (
          <div className="flex items-center justify-center py-20 rounded-xl border-2 border-dashed border-border">
            <p className="text-sm text-muted-foreground">{t('nometricmes')}</p>
          </div>
        )}
      </main>

      <Toaster />
    </div>
  );
}
