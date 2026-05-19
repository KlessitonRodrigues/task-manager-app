import { z } from "zod";
import { dictionaries } from "../constants/dictionary";
import { COMMON } from "../types/common";

export const createTranslateSchemas = (options: COMMON.CreateSchemaOptions) => {
  const dictionary = dictionaries[options.lang];

  const translateSchema = {
    text: z
      .string(dictionary.REQUIRED)
      .trim()
      .min(1, dictionary.REQUIRED)
      .max(500, dictionary.MAXIMUM_LENGTH_EXCEEDED),
    targetLanguageCode: z
      .string(dictionary.REQUIRED)
      .trim()
      .min(2, dictionary.REQUIRED),
    sourceLanguageCode: z
      .string(dictionary.REQUIRED)
      .trim()
      .min(2, dictionary.REQUIRED)
      .optional(),
  };

  return {
    translateTextSchema: z.object({
      text: translateSchema.text,
      targetLanguageCode: translateSchema.targetLanguageCode,
      sourceLanguageCode: translateSchema.sourceLanguageCode,
    }),
  };
};
