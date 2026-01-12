import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '../lib/i18n';

export type Language = 'fr' | 'he';
export type Direction = 'ltr' | 'rtl';

// Get initial language from i18n (which uses browser detection)
const getInitialLanguage = (): Language => {
  const detected = i18n.language;
  return detected === 'he' ? 'he' : 'fr';
};

interface LanguageState {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (fr: string, he: string) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: getInitialLanguage(),
      direction: getInitialLanguage() === 'he' ? 'rtl' : 'ltr',

      setLanguage: (lang) =>
        set({
          language: lang,
          direction: lang === 'he' ? 'rtl' : 'ltr',
        }),

      t: (fr, he) => (get().language === 'fr' ? fr : he),
    }),
    { name: 'davids-language' }
  )
);
