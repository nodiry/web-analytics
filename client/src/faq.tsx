import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from '@/components/ui/accordion';
import { useTranslation } from '@/i18n';

export default function FAQ() {
  const { t } = useTranslation();

  const items = [
    { value: 'free',     q: t('faq_q1'), a: t('faq_a1') },
    { value: 'tech',     q: t('faq_q2'), a: t('faq_a2') },
    { value: 'auth',     q: t('faq_q3'), a: t('faq_a3') },
    { value: 'mobile',   q: t('faq_q4'), a: t('faq_a4') },
    { value: 'privacy',  q: t('faq_q5'), a: t('faq_a5') },
  ];

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">{t('faq_title')}</h2>
      <Accordion type="single" collapsible className="w-full space-y-1">
        {items.map(({ value, q, a }) => (
          <AccordionItem key={value} value={value} className="border rounded-xl px-4">
            <AccordionTrigger className="text-sm md:text-base font-medium text-left hover:no-underline">
              {q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
              {a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
