import { COMMON } from '@packages/common-types';
import { getDefaultLanguage } from '@packages/daisy-ui-components';

import { dictinaries } from './useServerTranslation';

export const useClientTranslations = () => {
  const lang = getDefaultLanguage() as COMMON.Language;
  const translation = dictinaries[lang] || dictinaries['en'];
  const translate = (key: string) => translation[key] || 'NO_TEXT';
  return { lang, t: translate };
};
