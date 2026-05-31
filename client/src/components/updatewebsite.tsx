import { useState } from 'react';
import { SquarePen, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useTranslation } from '@/i18n';
import { websiteApi } from '@/api/websites';
import type { Website } from './types';

interface Props { website: Website }

export default function UpdateWebsiteDetails({ website }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(website.url);
  const [desc, setDesc] = useState(website.desc ?? '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) { toast.error('URL is required'); return; }
    setLoading(true);
    try {
      const { website: updated } = await websiteApi.update(website.unique_key, url.trim(), desc.trim());
      const stored: Website[] = JSON.parse(localStorage.getItem('web') || '[]');
      const filtered = stored.filter((w) => w.unique_key !== website.unique_key);
      filtered.push(updated);
      localStorage.setItem('web', JSON.stringify(filtered));
      toast.success('Website updated');
      setOpen(false);
      window.location.reload();
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
              <Button variant="outline" size="icon" className="h-8 w-8">
                <SquarePen className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t('editwebsite')}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="upd-url">{t('websiteurl')}</Label>
                  <Input id="upd-url" value={url} onChange={(e) => setUrl(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="upd-desc">{t('description')}</Label>
                  <Input id="upd-desc" value={desc} onChange={(e) => setDesc(e.target.value)} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('delconfirm')}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </TooltipTrigger>
        <TooltipContent>{t('editwebsite')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
