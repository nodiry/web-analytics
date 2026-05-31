import { useState } from 'react';
import { Eye, EyeOff, Edit, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from '@/i18n';
import { profileApi } from '@/api/profile';

interface User {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

interface Props { user: User }

export default function EditProfile({ user }: Props) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ ...user, password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user: updated } = await profileApi.update(form);
      localStorage.setItem('user', JSON.stringify(updated));
      toast.success('Profile updated');
      window.location.reload();
    } catch {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1.5" /> {t('editprofile')}
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>{t('editprofilemes')}</TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('editprofile')}</DialogTitle>
          <p className="text-sm text-muted-foreground">{t('editprofilemes')}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ep-fn">{t('firstname')}</Label>
              <Input id="ep-fn" name="firstname" value={form.firstname} onChange={handleChange} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ep-ln">{t('lastname')}</Label>
              <Input id="ep-ln" name="lastname" value={form.lastname} onChange={handleChange} required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ep-email">{t('email')}</Label>
            <Input id="ep-email" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ep-pass">{t('password')}</Label>
            <div className="relative">
              <Input
                id="ep-pass"
                name="password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('delconfirm')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
