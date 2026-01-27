import { zStringRequired } from '@small-mono-app/shared/src/zod'
import { zCreatePostTrpcInput } from '../createPost/input'

export const zUpdatePostTrpcInput =  zCreatePostTrpcInput.extend({
  postId: zStringRequired,
})
