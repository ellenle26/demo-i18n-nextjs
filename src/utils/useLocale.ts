import { useRouter } from 'next/router';
import en from './locales/en/en.json';
import ja from './locales/ja/ja.json';

export const useLocale = () => {
  const { locale, asPath } = useRouter();
  const t =
    locale === 'ja' ? ja : en;
  return { locale, t, asPath };
};
