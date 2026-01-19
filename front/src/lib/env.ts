import { z } from 'zod'
import { zStringRequired } from '../../../shared/src/zod'

export const zEnv = z.object({
  VITE_BACKEND_TRPC_URL: zStringRequired,
  VITE_WEBAPP_URL: zStringRequired,
})

// eslint-disable-next-line node/no-process-env
export const env = zEnv.parse(process.env)
