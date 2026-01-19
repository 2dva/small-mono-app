import { zStringRequired } from '@small-mono-app/shared/src/zod'
import { z } from 'zod'

export const zSetPostLikeTrpcInput =  z.object({
  postId: zStringRequired,
  isLikedByMe: z.boolean()
})
