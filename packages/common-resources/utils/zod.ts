import { ZodObject, ZodRawShape, z } from "zod";

type ZodDtoConstructor<T extends ZodRawShape> = {
  new (data: z.infer<ZodObject<T>>): z.infer<ZodObject<T>>;
  create(data: unknown): z.infer<ZodObject<T>>;
  schema: ZodObject<T>;
};

export function validateWith(schema: z.ZodTypeAny) {
  return class ValidatedClass<T> {
    constructor(data: T) {
      Object.assign(this, schema.parse(data));
    }
  };
}

export const zodErrorStringify = (error: z.ZodSafeParseError<any>) => {
  const errorMessages: string[] = [];
  for (const issue of error?.error?.issues) {
    errorMessages.push(`${issue.message}`);
  }
  return errorMessages.join(", ");
};

export function createZodDto<T extends ZodRawShape>(
  schema: ZodObject<T>,
): ZodDtoConstructor<T> {
  class ZodDto {
    static readonly schema = schema;

    constructor(data: z.infer<ZodObject<T>>) {
      Object.assign(this, data);
    }

    static create(data: unknown): z.infer<ZodObject<T>> {
      return schema.parse(data);
    }
  }

  return ZodDto as unknown as ZodDtoConstructor<T>;
}
