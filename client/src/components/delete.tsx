import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import { websiteApi } from '@/api/websites';
import type { Website } from './types';

interface Props { unique_key: string }

export default function DeleteWebsite({ unique_key }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirm !== 'DELETE') { toast.warning('Type DELETE to confirm'); return; }
    setLoading(true);
    try {
      await websiteApi.delete(unique_key);
      ['day', 'week', 'month', 'all'].forEach((p) =>
        localStorage.removeItem(`metrics_${unique_key}_${p}`),
      );
      const stored: Website[] = JSON.parse(localStorage.getItem('web') || '[]');
      localStorage.setItem('web', JSON.stringify(stored.filter((w) => w.unique_key !== unique_key)));
      toast.success('Website deleted');
      setOpen(false);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="icon" className="h-8 w-8">
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t('deletewebsite')}</DialogTitle>
                <p className="text-sm text-muted-foreground">{t('deletewebsitemes')}</p>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <p className="text-sm">
                  {t('pleaseinput')}{' '}
                  <span className="font-mono font-bold text-destructive">DELETE</span>{' '}
                  {t('deleteconfirm')}
                </p>
                <Input
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="DELETE"
                  disabled={loading}
                />
                <Button variant="destructive" type="submit" disabled={loading || confirm !== 'DELETE'} className="w-full">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('deletewebsite')}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </TooltipTrigger>
        <TooltipContent>{t('deletewebsitemes')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
