import { zEnvNonemptyTrimmed, zEnvNonemptyTrimmedRequiredOnNotLocal } from '@small-mono-app/shared/src/zod'
import { z } from 'zod'

export const zEnv = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  VITE_BACKEND_TRPC_URL: zEnvNonemptyTrimmed,
  VITE_WEBAPP_URL: zEnvNonemptyTrimmed,
  VITE_CLOUDINARY_CLOUD_NAME: zEnvNonemptyTrimmed,
  VITE_MIXPANEL_API_KEY: zEnvNonemptyTrimmedRequiredOnNotLocal,
})

// eslint-disable-next-line node/no-process-env
export const env = zEnv.parse(process.env)
