import { useState } from 'react';
import { RefreshCcw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useTranslation } from '@/i18n';
import { websiteApi } from '@/api/websites';
import type { Website } from './types';

interface Props { unique_key: string }

export default function UpdateWebsite({ unique_key }: Props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleRenew = async () => {
    setLoading(true);
    try {
      const { website } = await websiteApi.renew(unique_key);
      const stored: Website[] = JSON.parse(localStorage.getItem('web') || '[]');
      const idx = stored.findIndex((s) => s.unique_key === unique_key);
      if (idx !== -1) stored[idx] = website;
      localStorage.setItem('web', JSON.stringify(stored));
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleRenew} disabled={loading}>
            {loading
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <RefreshCcw className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('updatewebsite')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
