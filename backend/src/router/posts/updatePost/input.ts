import { zCreatePostTrpcInput } from '../createPost/input'
import { zStringRequired } from '@small-mono-app/shared/src/zod'

export const zUpdatePostTrpcInput =  zCreatePostTrpcInput.extend({
  postId: zStringRequired,
})
