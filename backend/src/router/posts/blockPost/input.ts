import { zStringRequired } from '@small-mono-app/shared/src/zod'
import { z } from 'zod'

export const zBlockPostTrpcInput = z.object({
  postId: zStringRequired,
})
