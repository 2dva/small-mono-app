import { omit } from '@small-mono-app/shared/src/omit'
import z from 'zod'
import { trpcLoggedProcedure } from '../../../lib/trpc'

export const getPostTrpcRoute = trpcLoggedProcedure.input(z.object({ nick: z.string() })).query(async (req) => {
  const { ctx, input } = req
  console.log(`BACK:TRPC:getPost:byId: ${input.nick}`)
  const rawPost = await ctx.prisma.post.findUnique({
    where: { nick: input.nick },
    include: {
      author: {
        select: {
          id: true,
          nick: true,
          name: true,
        },
      },
      postLikes: {
        select: {
          id: true,
        },
        where: {
          userId: ctx.me?.id,
        },
      },
      _count: {
        select: {
          postLikes: true,
        },
      },
    },
  })
  if (rawPost?.blockedAt) {
    throw new Error('Post is blocked by administrator')
  }

  const isLikedByMe = !!rawPost?.postLikes.length
  const likesCount = rawPost?._count.postLikes || 0
  const post = rawPost && { ...omit(rawPost, ['postLikes', '_count']), isLikedByMe, likesCount }
  console.log(`BACK:TRPC:getPost:post: ${rawPost}`)
  return { post }
})
