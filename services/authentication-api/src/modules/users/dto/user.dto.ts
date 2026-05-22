import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const userSchema = {
  id: z.number().int(),
  email: z.string().email(),
  password: z.string(),
  recoveryToken: z.string(),
  recoveryTokenExpiration: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
};

export class CreateUserDto extends createZodDto(
  z.object({
    name: userSchema.name,
    email: userSchema.email,
    password: userSchema.password,
  }),
) {}
