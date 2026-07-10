import { getDefaultLanguage } from "@packages/daisy-ui-components/utils/html.js";
import { dictinaries } from "./useServerTranslation";

export const useClientTranslations = () => {
  const lang = getDefaultLanguage() as keyof typeof dictinaries;
  const translation = dictinaries[lang] || dictinaries["en"];
  const translate = (key: string) => translation[key] || "NO_TEXT";
  return { lang, t: translate };
};
