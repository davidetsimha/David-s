import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'fr' | 'he';
export type Direction = 'ltr' | 'rtl';

interface LanguageState {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (fr: string, he: string) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'fr',
      direction: 'ltr',

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
