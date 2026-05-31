import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/i18n';
import { profileApi } from '@/api/profile';

interface Props { username: string }

export default function DeleteProfile({ username }: Props) {
  const { t } = useTranslation();
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirmation !== 'DELETE') return;
    setLoading(true);
    try {
      await profileApi.delete(username);
      toast.success('Account deleted');
      localStorage.clear();
      window.location.href = '/';
    } catch {
      toast.error('Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">{t('deleteprofile')}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('areusure')}</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          {t('deletemes1')}{' '}
          <span className="font-mono font-bold text-destructive">DELETE</span>{' '}
          {t('deletemes2')}
        </p>

        <Input
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          placeholder="DELETE"
          className="mt-2"
        />

        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={confirmation !== 'DELETE' || loading}
          className="w-full mt-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('delconfirm')}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
