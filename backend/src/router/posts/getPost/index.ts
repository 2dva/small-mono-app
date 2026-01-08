import z from 'zod'
import { trpc } from '../../../lib/trpc'
import { defaultPosts } from '../getPosts'

export const getPostTrpcRoute = trpc.procedure.input(z.object({ nick: z.string() })).query(async (req) => {
  const { ctx, input } = req
  console.log(`BACK:TRPC:getPost:byId: ${input.nick}`)
  // const post = defaultPosts.find((el) => { return el.nick === id ? true: false})
  const post = await ctx.prisma.post.findUnique({
    where: { nick: input.nick },
  })
  console.log(`BACK:TRPC:getPost:post: ${post}`)
  return { post: post || null }
})
