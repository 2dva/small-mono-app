import { trpc } from '../../../lib/trpc'
import { zSetPostLikeTrpcInput } from './input'

export const setPostLikeTrpcRoute = trpc.procedure.input(zSetPostLikeTrpcInput).mutation(async ({ input, ctx }) => {
  if (!ctx.me) {
    throw Error('UNAUTHORIZED')
  }
  const { postId, isLikedByMe } = input
  console.log(`BACK:TRPC:likePost:start`)
  const post = await ctx.prisma.post.findUnique({
    where: {
      id: postId,
    },
  })
  if (!post) {
    throw new Error('NOT_FOUND')
  }
  if (isLikedByMe) {
    await ctx.prisma.postLike.upsert({
      where: {
        postId_userId: {
          postId,
          userId: ctx.me.id
        }
      },
      create: {
        userId: ctx.me.id,
        postId,
      },
      update: {},
    })
  } else {
    await ctx.prisma.postLike.delete({
      where: {
        postId_userId: {
          postId,
          userId: ctx.me.id,
        },
      }
    })
  }
  const likesCount = await ctx.prisma.postLike.count({
    where: {
      postId
    }
  })
  console.log(`BACK:TRPC:likePost:SUCCESS`)
  return {
    post: {
      id: post.id,
      likesCount,
      isLikedByMe,
    },
  }
})
