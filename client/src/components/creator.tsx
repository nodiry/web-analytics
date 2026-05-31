import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/i18n';
import { websiteApi } from '@/api/websites';

export default function WebsiteCreator() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);

  const userId = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}')._id ?? ''; } catch { return ''; }
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) { toast.error('Website URL is required.'); return; }
    setLoading(true);
    try {
      const { website } = await websiteApi.create(userId, url.trim(), desc.trim());
      const stored: unknown[] = JSON.parse(localStorage.getItem('web') || '[]');
      stored.push(website);
      localStorage.setItem('web', JSON.stringify(stored));
      toast.success('Website added!');
      setUrl(''); setDesc(''); setOpen(false);
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1.5" /> {t('addwebsite')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('addwebsite')}</DialogTitle>
          <p className="text-sm text-muted-foreground">{t('addwebsitemes')}</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="url">{t('websiteurl')}</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="desc">{t('description')} (optional)</Label>
            <Input
              id="desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="A short description"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>{t('NotFound') && 'Cancel'}</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('addwebsite')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
