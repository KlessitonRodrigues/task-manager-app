import enLang from '@/public/i18n/en.json';
import ptLang from '@/public/i18n/pt.json';

export const dictinaries: Record<string, Record<string, string>> = {
  en: enLang,
  pt: ptLang,
};

export const useServerTranslations = async (props: any) => {
  const { lang } = await props.params;
  const dictionary = dictinaries[lang] || dictinaries['en'];
  const translate = (key: string) => dictionary[key] || 'NO_TEXT';
  return { lang, t: translate };
};

export const generateStaticParams = () => {
  return [{ lang: 'en' }, { lang: 'pt' }];
};

export const setTranslationEnv = (lang: string) => {
  process.env.NEXT_PUBLIC_APP_LOCALE = lang;
};
