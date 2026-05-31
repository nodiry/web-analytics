import React, { createContext, useContext, useState, useCallback } from 'react';
import ko from './locales/ko';
import en from './locales/en';
import ru from './locales/ru';
import type { TranslationKeys } from './locales/ko';

export type Lang = 'ko' | 'en' | 'ru';

type Translations = Record<TranslationKeys, string>;

const locales: Record<Lang, Translations> = {
  ko: ko as Translations,
  en,
  ru,
};

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKeys) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem('lang');
    if (stored === 'ko' || stored === 'en' || stored === 'ru') return stored;
    return 'ko';
  });

  const setLang = useCallback((newLang: Lang) => {
    localStorage.setItem('lang', newLang);
    setLangState(newLang);
  }, []);

  const t = useCallback(
    (key: TranslationKeys): string =>
      locales[lang][key] ?? locales.en[key] ?? (key as string),
    [lang],
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used inside I18nProvider');
  return ctx;
}
