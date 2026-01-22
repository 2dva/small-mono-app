import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zBlockPostTrpcInput } from './input'

export const blockPostTrpcRoute = trpcLoggedProcedure.input(zBlockPostTrpcInput).mutation(async ({ ctx, input }) => {
  const { postId } = input
  if (!ctx.me?.role) {
    throw Error('PERMISSION_DENIED')
  }

  const post = await ctx.prisma.post.findUnique({
    where: {
      id: postId,
    },
  })
  if (!post) {
    throw new Error('NOT_FOUND')
  }
  await ctx.prisma.post.update({
    where: {
      id: postId,
    },
    data: { 
      blockedAt: new Date(),
    },
  })

  console.log(`BACK:TRPC:blockPost:SUCCESS`)
  return true
})
