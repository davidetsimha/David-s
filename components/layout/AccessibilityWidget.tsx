'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

const STORAGE_KEY = 'accessibility-settings';

interface AccessibilitySettings {
  fontSize: number; // 0, 1, 2
  highContrast: boolean;
  grayscale: boolean;
  underlineLinks: boolean;
  readableFont: boolean;
  stopAnimations: boolean;
  largeCursor: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 0,
  highContrast: false,
  grayscale: false,
  underlineLinks: false,
  readableFont: false,
  stopAnimations: false,
  largeCursor: false,
};

function applySettings(settings: AccessibilitySettings) {
  const html = document.documentElement;

  // Font size
  html.classList.remove('a11y-font-1', 'a11y-font-2');
  if (settings.fontSize === 1) html.classList.add('a11y-font-1');
  if (settings.fontSize === 2) html.classList.add('a11y-font-2');

  // Toggle classes
  html.classList.toggle('a11y-high-contrast', settings.highContrast);
  html.classList.toggle('a11y-grayscale', settings.grayscale);
  html.classList.toggle('a11y-underline-links', settings.underlineLinks);
  html.classList.toggle('a11y-readable-font', settings.readableFont);
  html.classList.toggle('a11y-stop-animations', settings.stopAnimations);
  html.classList.toggle('a11y-large-cursor', settings.largeCursor);
}

export function AccessibilityWidget() {
  const t = useTranslations('accessibility');
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AccessibilitySettings;
        setSettings(parsed);
        applySettings(parsed);
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const updateSetting = useCallback(
    <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
      setSettings((prev) => {
        const next = { ...prev, [key]: value };
        applySettings(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const resetAll = useCallback(() => {
    setSettings(defaultSettings);
    applySettings(defaultSettings);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const cycleFontSize = useCallback(() => {
    setSettings((prev) => {
      const next = { ...prev, fontSize: ((prev.fontSize + 1) % 3) as 0 | 1 | 2 };
      applySettings(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 start-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg transition-transform hover:scale-110 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={t('title')}
        title={t('title')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <circle cx="12" cy="4" r="2" />
          <path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.01 0-.01-.01-.02-.01H13c-.35-.2-.75-.3-1.19-.26C10.76 7.11 10 8.04 10 9.09V15c0 1.1.9 2 2 2h5v5h2v-5.5c0-1.1-.9-2-2-2h-3v-3.45c1.29 1.07 3.25 1.94 5 1.95zm-6.17 5c-.41 1.16-1.52 2-2.83 2-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V12.1c-2.28.46-4 2.48-4 4.9 0 2.76 2.24 5 5 5 2.42 0 4.44-1.72 4.9-4h-2.07z" />
        </svg>
      </button>

      {/* Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/30"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            role="dialog"
            aria-label={t('title')}
            className="fixed bottom-20 start-5 z-50 w-72 rounded-xl bg-white p-4 shadow-2xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900">{t('title')}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded p-1 text-stone-500 hover:bg-stone-100"
                aria-label={t('close')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="space-y-2">
              {/* Font size */}
              <button
                onClick={cycleFontSize}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-start text-sm transition-colors ${
                  settings.fontSize > 0 ? 'bg-blue-100 text-blue-800' : 'hover:bg-stone-100'
                }`}
              >
                <span className="text-lg">🔤</span>
                <span>{t('fontSize')}</span>
                {settings.fontSize > 0 && (
                  <span className="ms-auto text-xs font-medium">+{settings.fontSize}</span>
                )}
              </button>

              {/* High contrast */}
              <ToggleOption
                active={settings.highContrast}
                onClick={() => updateSetting('highContrast', !settings.highContrast)}
                icon="🌓"
                label={t('highContrast')}
              />

              {/* Grayscale */}
              <ToggleOption
                active={settings.grayscale}
                onClick={() => updateSetting('grayscale', !settings.grayscale)}
                icon="🩶"
                label={t('grayscale')}
              />

              {/* Underline links */}
              <ToggleOption
                active={settings.underlineLinks}
                onClick={() => updateSetting('underlineLinks', !settings.underlineLinks)}
                icon="🔗"
                label={t('underlineLinks')}
              />

              {/* Readable font */}
              <ToggleOption
                active={settings.readableFont}
                onClick={() => updateSetting('readableFont', !settings.readableFont)}
                icon="Aa"
                label={t('readableFont')}
              />

              {/* Stop animations */}
              <ToggleOption
                active={settings.stopAnimations}
                onClick={() => updateSetting('stopAnimations', !settings.stopAnimations)}
                icon="⏸"
                label={t('stopAnimations')}
              />

              {/* Large cursor */}
              <ToggleOption
                active={settings.largeCursor}
                onClick={() => updateSetting('largeCursor', !settings.largeCursor)}
                icon="🖱"
                label={t('largeCursor')}
              />

              {/* Reset */}
              <button
                onClick={resetAll}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-100"
              >
                {t('reset')}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function ToggleOption({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-start text-sm transition-colors ${
        active ? 'bg-blue-100 text-blue-800' : 'hover:bg-stone-100'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
