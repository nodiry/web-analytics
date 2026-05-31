import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useTranslation } from '@/i18n';

const STEP_COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];
const STEP_ICONS  = ['🌐', '📡', '⚡', '🗄️', '⏱️', '📊'];

const Arrow = ({ index, total }: { index: number; total: number }) => {
  if (index >= total - 1) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ delay: 0.3 + index * 0.15, duration: 0.4 }}
      className="flex items-center justify-center shrink-0 mx-1"
    >
      <svg width="28" height="10" viewBox="0 0 28 10" fill="none">
        <motion.path
          d="M0 5 L20 5 M15 1 L20 5 L15 9"
          stroke="#6B7280"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.4 + index * 0.15, duration: 0.4 }}
        />
      </svg>
    </motion.div>
  );
};

export default function HowItWorks() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const steps = [
    { label: t('hiw_s1_label'), desc: t('hiw_s1_desc') },
    { label: t('hiw_s2_label'), desc: t('hiw_s2_desc') },
    { label: t('hiw_s3_label'), desc: t('hiw_s3_desc') },
    { label: t('hiw_s4_label'), desc: t('hiw_s4_desc') },
    { label: t('hiw_s5_label'), desc: t('hiw_s5_desc') },
    { label: t('hiw_s6_label'), desc: t('hiw_s6_desc') },
  ];

  const facts = [
    { label: t('hiw_fact1_label'), desc: t('hiw_fact1_desc') },
    { label: t('hiw_fact2_label'), desc: t('hiw_fact2_desc') },
    { label: t('hiw_fact3_label'), desc: t('hiw_fact3_desc') },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Sparkles className="h-4 w-4" />
          {t('hiw_button')}
        </Button>
      </DialogTrigger>

      {/* Wide dialog, no forced height — let content breathe */}
      <DialogContent className="w-[min(95vw,56rem)] max-w-none p-0 overflow-hidden">
        <div className="p-6 space-y-6 overflow-y-auto max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{t('hiw_title')}</DialogTitle>
            <p className="text-sm text-muted-foreground">{t('hiw_subtitle')}</p>
          </DialogHeader>

          {/* Flow diagram — horizontal scroll on narrow viewports */}
          <div className="overflow-x-auto -mx-6 px-6">
            <div className="flex items-start min-w-max gap-0 py-2">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.35, type: 'spring' }}
                    className="flex flex-col items-center text-center w-28 px-1"
                  >
                    <motion.div
                      whileHover={{ scale: 1.12, rotate: 6 }}
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-2.5 shadow-md"
                      style={{
                        backgroundColor: STEP_COLORS[i] + '1a',
                        border: `2px solid ${STEP_COLORS[i]}50`,
                      }}
                    >
                      {STEP_ICONS[i]}
                    </motion.div>
                    <p
                      className="text-[11px] font-bold leading-tight mb-1"
                      style={{ color: STEP_COLORS[i] }}
                    >
                      {step.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-snug">{step.desc}</p>
                  </motion.div>
                  <Arrow index={i} total={steps.length} />
                </div>
              ))}
            </div>
          </div>

          {/* Embed snippet */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="rounded-xl border bg-muted/30 p-4"
          >
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {t('hiw_embed_title')}
            </p>
            <pre className="text-sm font-mono text-emerald-400 bg-black/40 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all">
{`<script src="https://track.glasscube.io/embed.js?key=YOUR_KEY"></script>`}
            </pre>
            <p className="text-xs text-muted-foreground mt-2">{t('hiw_embed_desc')}</p>
          </motion.div>

          {/* Key facts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {facts.map((fact, i) => (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.95 + i * 0.08 }}
                className="rounded-lg border bg-muted/20 p-3"
              >
                <p className="text-sm font-semibold">{fact.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{fact.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
