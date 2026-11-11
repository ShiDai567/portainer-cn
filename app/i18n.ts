import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../translations/en/translation.json';
import zhCN from '../translations/zh-CN/translation.json';

const languageDetector = new LanguageDetector();

// i18next 21 does not normalize regional browser languages before checking
// supportedLngs. Resolve them before selecting the bundled resource.
languageDetector.addDetector({
  name: 'portainerLanguage',
  lookup() {
    let cached: string | null = null;
    try {
      cached = window.localStorage.getItem('i18nextLng');
    } catch {
      // Browser policies can disable storage; detection still works.
    }
    const candidates = [cached, ...navigator.languages, navigator.language];

    for (const language of candidates) {
      if (typeof language === 'string') {
        if (/^zh(?:-|$)/i.test(language)) {
          return 'zh-CN';
        }
        if (/^en(?:-|$)/i.test(language)) {
          return 'en';
        }
      }
    }

    return 'en';
  },
  cacheUserLanguage(language) {
    try {
      window.localStorage.setItem('i18nextLng', language);
    } catch {
      // Keep the current session usable when preferences cannot be saved.
    }
  },
});

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    initImmediate: false,
    supportedLngs: ['en', 'zh-CN'],
    load: 'currentOnly',
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      'zh-CN': { translation: zhCN },
    },
    detection: {
      order: ['portainerLanguage'],
      caches: ['portainerLanguage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

function updateDocumentLanguage(language: string) {
  document.documentElement.lang = language;
}

updateDocumentLanguage(i18n.resolvedLanguage || 'en');
i18n.on('languageChanged', updateDocumentLanguage);

export default i18n;
