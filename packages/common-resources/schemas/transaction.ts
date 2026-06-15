import { z } from "zod";
import { COMMON } from "../@types/common";
import { formErrors } from "../constants/formErrors";

export const createTransactionSchemas = (
  options: COMMON.CreateSchemaOptions,
) => {
  const err = formErrors[options.lang];

  const transactionSchema = {
    id: z.string().default(""),
    name: z.string().min(3, err.REQUIRED).default(""),
    date: z.string().default(""),
    type: z.string().min(1, err.REQUIRED).default(""),
    value: z.coerce.number().positive(err.MUST_BE_POSITIVE).default(0),
  };

  return {
    createTransaction: z.object({
      name: transactionSchema.name,
      date: transactionSchema.date,
      value: transactionSchema.value,
      type: transactionSchema.type,
    }),
  };
};
