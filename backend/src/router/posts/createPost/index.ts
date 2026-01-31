import { logger } from '../../../lib/logger'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zCreatePostTrpcInput } from './input'

export const createPostTrpcRoute = trpcLoggedProcedure.input(zCreatePostTrpcInput).mutation(async ({ input, ctx }) => {
  if (!ctx.me) {
    throw Error('UNAUTHORIZED')
  }
  logger.info('back:trpc', `createPost:start`)
  const exPost = await ctx.prisma.post.findUnique({
    where: {
      nick: input.nick,
    },
  })
  if (exPost) {
    throw new Error('Post with this nick already exists')
  }
  await ctx.prisma.post.create({
    data: { ...input, authorId: ctx.me.id },
  })
  logger.info('back:trpc', `createPost:SUCCESS`)
  return true
})
