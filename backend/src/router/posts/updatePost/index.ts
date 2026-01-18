import { trpc } from '../../../lib/trpc'
import { canEditPost } from '../../../utils/can'
import { zUpdatePostTrpcInput } from './input'

export const updatePostTrpcRoute = trpc.procedure.input(zUpdatePostTrpcInput).mutation(async ({ ctx, input }) => {
  const { postId, ...postINput } = input
  if (!ctx.me) {
    throw Error('UNAUTHORIZED')
  }

  console.log(`BACK:TRPC:updatePost:postId=${postId}`)

  const post = await ctx.prisma.post.findUnique({
    where: {
      id: postId,
    },
  })
  if (!post) {
    throw new Error('NOT_FOUND')
  }
  if (!canEditPost(ctx.me, post)) {
    throw Error('NOT_YOUR_POST')
  }
  if (post.nick !== input.nick) {
    const exPost = await ctx.prisma.post.findUnique({
      where: {
        nick: input.nick,
      },
    })
    if (exPost) {
      throw Error('Post with this nick already exists')
    }
  }

  await ctx.prisma.post.update({
    where: {
      id: postId,
    },
    data: { ...postINput },
  })

  console.log(`BACK:TRPC:updatePost:SUCCESS`)
  return true
})
