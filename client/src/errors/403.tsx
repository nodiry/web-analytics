import NavBar from '../components/NavBar';
import { useTranslation } from '@/i18n';

export default function Forbidden() {
  const { t } = useTranslation();
  const user = localStorage.getItem('user');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {user && <NavBar />}
      <div className="flex flex-col items-center justify-center flex-1 gap-4 pt-16">
        <p className="text-8xl font-bold text-destructive/70">403</p>
        <p className="text-xl text-muted-foreground">{t('Forbidden')}</p>
      </div>
    </div>
  );
}
