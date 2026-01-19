import * as dotenv from 'dotenv'
import z from 'zod'

dotenv.config()

const zNonEmptyTrimmed = z.string().trim().min(1)

const zNonEmptyTrimmedRequiredOnProd = zNonEmptyTrimmed
  .optional()
  .refine((val) => process.env.HOST_ENV === 'local' || !!val, 'Required on local host')

const zEnv = z.object({
  PORT: zNonEmptyTrimmed,
  HOST_ENV: z.enum(['local', 'production']),
  DATABASE_URL: zNonEmptyTrimmed,
  JWT_SECRET: zNonEmptyTrimmed,
  PASSWORD_SALT: zNonEmptyTrimmed,
  INITIAL_ADMIN_PASSWORD: zNonEmptyTrimmed,
})

export const env = zEnv.parse(process.env)
