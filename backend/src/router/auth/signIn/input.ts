import z from 'zod'
import { zStringRequired } from '@small-mono-app/shared/src/zod'

export const zSignInTrpcInput = z.object({
  nick: zStringRequired,
  password: zStringRequired,
})
