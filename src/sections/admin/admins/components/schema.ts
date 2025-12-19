import { z as zod } from 'zod';

import { PASSWORD_REG_EXP } from 'src/consts';

export type SchemaType = zod.infer<typeof Schema>;

export const Schema = zod.object({
  name: zod.string().min(1, { message: 'Name is required' }),
  email: zod
    .string({ error: 'Email is required' })
    .email({ message: 'Invalid email address is provided' }),
  password: zod
    .string()
    .min(1, { message: 'New password is required!' })
    .min(8, { message: 'Password must be at least 8 characters!' })
    .regex(PASSWORD_REG_EXP, {
      message: 'Password must include uppercase, lowercase, number, and special character!',
    }),
});
