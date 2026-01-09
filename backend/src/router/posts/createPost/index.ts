import { trpc } from '../../../lib/trpc'
import { zCreatePostTrpcInput } from './input'

export const createPostTrpcRoute = trpc.procedure.input(zCreatePostTrpcInput).mutation(async ({ input, ctx }) => {
  if (!ctx.me) {
    throw Error('UNAUTHORIZED')
  }
  console.log(`BACK:TRPC:createPost:start`)
  const exIdea = await ctx.prisma.post.findUnique({
    where: {
      nick: input.nick,
    },
  })
  if (exIdea) {
    throw new Error('Idea with this nick already exists')
  }
  await ctx.prisma.post.create({
    data: { ...input, authorId: ctx.me.id },
  })
  console.log(`BACK:TRPC:createPost:SUCCESS`)
  return true
})
