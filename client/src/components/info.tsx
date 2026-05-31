import { InfoIcon } from 'lucide-react';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useTranslation } from '@/i18n';

interface Props { date: string; url: string; desc: string }

export default function Info({ date, url, desc }: Props) {
  const { t } = useTranslation();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <InfoIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-base">{url}</DialogTitle>
                <DialogDescription>{desc || '—'}</DialogDescription>
              </DialogHeader>
              <DialogFooter className="text-xs text-muted-foreground">
                {t('created')} {date}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TooltipTrigger>
        <TooltipContent>{t('infomes')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
