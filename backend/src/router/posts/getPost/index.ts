import z from 'zod'
import { trpc } from '../../../lib/trpc'

export const getPostTrpcRoute = trpc.procedure.input(z.object({ nick: z.string() })).query(async (req) => {
  const { ctx, input } = req
  console.log(`BACK:TRPC:getPost:byId: ${input.nick}`)
  const post = await ctx.prisma.post.findUnique({
    where: { nick: input.nick },
    include: {
      author: {
        select: {
          id: true,
          nick: true,
          name: true,
        }
      }
    }
  })
  console.log(`BACK:TRPC:getPost:post: ${post}`)
  return { post: post || null }
})
