import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from '@/components/ui/sonner';
import NavBar from '@/components/NavBar';
import WebsiteCreator from '@/components/creator';
import WebsiteCard from '@/components/webcard';
import { useTranslation } from '@/i18n';
import { Globe2 } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [websites, setWebsites] = useState<any[] | null>(null);

  useEffect(() => {
    try {
      const webs = localStorage.getItem('web');
      if (webs) setWebsites(JSON.parse(webs));
      else navigate('/');
    } catch {
      navigate('/');
    }
  }, [navigate]);

  if (!websites) return null;

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="max-w-4xl mx-auto px-4 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('dashboard')}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {websites.length}{' '}
              {t('website')}{websites.length !== 1 ? 's' : ''} {websites.length > 0 ? 'tracked' : ''}
            </p>
          </div>
          {websites.length > 0 && <WebsiteCreator />}
        </motion.div>

        {websites.length > 0 ? (
          <div className="space-y-3">
            {websites.map((w, i) => (
              <motion.div
                key={w._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
              >
                <WebsiteCard website={w} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-24 rounded-2xl border-2 border-dashed border-border"
          >
            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Globe2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-1">{t('nowebmes')}</h2>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-xs">
              Add your first website to start tracking analytics.
            </p>
            <WebsiteCreator />
          </motion.div>
        )}
      </main>
      <Toaster />
    </div>
  );
}
