import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import DeleteProfile from '@/components/deleteProfile';
import EditProfile from '@/components/editProfile';
import { useTranslation } from '@/i18n';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Mail, ShieldCheck, ShieldOff, Clock } from 'lucide-react';

interface User {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  img_url?: string;
  authorized: boolean;
  password: string;
  created_at: string;
  modified_at: string;
}

function formatDate(d: string | undefined) {
  if (!d) return '—';
  const date = new Date(d);
  if (isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(date);
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/'); return; }
    setUser(JSON.parse(stored));
  }, [navigate]);

  if (!user) return null;

  const initials = `${user.firstname?.[0] ?? ''}${user.lastname?.[0] ?? ''}`.toUpperCase() || user.username?.[0]?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="max-w-2xl mx-auto px-4 pt-20 pb-16">
        <div className="mt-6 rounded-2xl border border-border/60 bg-card overflow-hidden">
          {/* Header band */}
          <div className="h-20 bg-gradient-to-r from-primary/20 to-primary/5" />

          {/* Avatar + name */}
          <div className="px-6 pb-6">
            <div className="-mt-10 flex items-end justify-between mb-4">
              <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                <AvatarImage src={user.img_url} alt={user.username} />
                <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <Badge variant={user.authorized ? 'default' : 'destructive'} className="mb-1">
                {user.authorized
                  ? <><ShieldCheck className="h-3 w-3 mr-1" /> Authorized</>
                  : <><ShieldOff  className="h-3 w-3 mr-1" /> Unauthorized</>}
              </Badge>
            </div>

            <h1 className="text-xl font-bold">{user.firstname} {user.lastname}</h1>
            <p className="text-sm text-muted-foreground">@{user.username}</p>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="h-4 w-4 shrink-0" />
                <span>{t('created')} {formatDate(user.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0" />
                <span>{t('last_modified')} {formatDate(user.modified_at)}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <EditProfile user={user} />
              <DeleteProfile username={user.username} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
