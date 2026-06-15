import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class ErrorDto extends createZodDto(
  z.object({
    message: z.string(),
    errCode: z.string().optional(),
    errDetails: z.any().optional(),
  }),
) {}
