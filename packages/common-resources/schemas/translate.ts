import { z } from "zod";
import { COMMON } from "../@types/common";
import formErrors from "../constants/formErrors";

export const createTranslateSchemas = (options: COMMON.CreateSchemaOptions) => {
  const err = formErrors[options.lang];

  const translateSchema = {
    text: z
      .string(err.REQUIRED)
      .trim()
      .min(1, err.REQUIRED)
      .max(500, err.MAXIMUM_LENGTH_EXCEEDED),
    targetLanguageCode: z.string(err.REQUIRED).trim().min(2, err.REQUIRED),
    sourceLanguageCode: z
      .string(err.REQUIRED)
      .trim()
      .min(2, err.REQUIRED)
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
