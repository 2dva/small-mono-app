import { appContext, createPostWithAuthor, createUser, getTrpcCaller } from '../../../test/integration'

describe('setPostLike', () => {
  it('create like', async () => {
    const { post } = await createPostWithAuthor({ number: 1 })
    const liker = await createUser({ number: 2 })
    const trpcCallerForLiker = getTrpcCaller(liker)
    const result = await trpcCallerForLiker.setPostLike({
      postId: post.id,
      isLikedByMe: true,
    })
    expect(result).toMatchObject({
      post: {
        isLikedByMe: true,
        likesCount: 1,
      },
    })
    const postLikes = await appContext.prisma.postLike.findMany()
    expect(postLikes).toHaveLength(1)
    expect(postLikes[0]).toMatchObject({
      postId: post.id,
      userId: liker.id,
    })
  })

  it('remove like', async () => {
    const { post } = await createPostWithAuthor({ number: 1 })
    const liker = await createUser({ number: 2 })
    const trpcCallerForLiker = getTrpcCaller(liker)
    const result1 = await trpcCallerForLiker.setPostLike({
      postId: post.id,
      isLikedByMe: true,
    })
    expect(result1).toMatchObject({
      post: {
        isLikedByMe: true,
        likesCount: 1,
      },
    })
    const result2 = await trpcCallerForLiker.setPostLike({
      postId: post.id,
      isLikedByMe: false,
    })
    expect(result2).toMatchObject({
      post: {
        isLikedByMe: false,
        likesCount: 0,
      },
    })
    const postLikes = await appContext.prisma.postLike.findMany()
    expect(postLikes).toHaveLength(0)
  })
})
