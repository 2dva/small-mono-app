import * as dotenv from 'dotenv'
import z from 'zod'
import { zEnvHost, zEnvNonemptyTrimmed } from '@small-mono-app/shared/src/zod'

dotenv.config()

const zEnv = z.object({
  PORT: zEnvNonemptyTrimmed,
  HOST_ENV: zEnvHost,
  DATABASE_URL: zEnvNonemptyTrimmed,
  JWT_SECRET: zEnvNonemptyTrimmed,
  PASSWORD_SALT: zEnvNonemptyTrimmed,
  INITIAL_ADMIN_PASSWORD: zEnvNonemptyTrimmed,
})

export const env = zEnv.parse(process.env)
