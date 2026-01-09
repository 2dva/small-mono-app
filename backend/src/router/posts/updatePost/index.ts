import { zUpdatePostTrpcInput } from "./input";
import { trpc } from '../../../lib/trpc'

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
  if (ctx.me.id !== post.authorId) {
    throw Error('NOT_YOUR_IDEA')
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
