import { zNickRequired, zStringOptional, zStringRequired } from '@small-mono-app/shared/src/zod'
import { z } from 'zod'

export const zCreatePostTrpcInput = z.object({
  title: zStringRequired,
  nick: zNickRequired,
  description: zStringRequired,
  content: z.string().min(50),
  images: zStringOptional,
})
