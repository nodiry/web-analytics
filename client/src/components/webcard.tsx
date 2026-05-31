import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Globe, TrendingUp, Users, Activity, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Website } from './types';
import { useTranslation } from '@/i18n';
import UpdateWebsite from './update';

interface WebsiteCardProps { website: Website }

function fSD(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ website }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { url, stats, desc } = website;

  const displayUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');

  const statItems = [
    {
      icon: <TrendingUp className="h-3.5 w-3.5" />,
      label: t('totalvisits'),
      value: stats.total_visits.toLocaleString(),
    },
    {
      icon: <Users className="h-3.5 w-3.5" />,
      label: t('uniquevisits'),
      value: stats.unique_visitors.toLocaleString(),
    },
    {
      icon: <Activity className="h-3.5 w-3.5" />,
      label: t('bouncerate'),
      value: `${stats.bounce_rate.toFixed(1)}%`,
    },
    {
      icon: <Clock className="h-3.5 w-3.5" />,
      label: t('avgses'),
      value: fSD(stats.avg_session_duration),
    },
  ];

  return (
    <div className="group rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 p-5">
      <div className="flex items-start justify-between gap-4">
        {/* Left: identity */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Globe className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <a
                href={url.startsWith('http') ? url : `https://${url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-sm text-foreground hover:text-primary truncate flex items-center gap-1 transition-colors"
              >
                {displayUrl}
                <ArrowUpRight className="h-3 w-3 opacity-50 group-hover:opacity-100 shrink-0" />
              </a>
            </div>
            {desc && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">{desc}</p>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <UpdateWebsite unique_key={website.unique_key} />
          <Button
            size="sm"
            onClick={() => navigate(`/metrics/${website.unique_key}/1`)}
            className="h-8 gap-1.5"
          >
            {t('metrics')}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="rounded-lg bg-muted/40 px-3 py-2.5 flex flex-col gap-1"
          >
            <div className="flex items-center gap-1.5 text-muted-foreground">
              {item.icon}
              <span className="text-[11px] font-medium uppercase tracking-wide leading-none">
                {item.label}
              </span>
            </div>
            <span className="text-lg font-bold leading-none">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Top pages preview */}
      {stats.pages.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {stats.pages.slice(0, 4).map((page, i) => (
            <Badge key={i} variant="secondary" className="text-xs font-normal">
              {page.path}
              <span className="ml-1 text-muted-foreground">{page.visits}</span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export const StatCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
  <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default WebsiteCard;
