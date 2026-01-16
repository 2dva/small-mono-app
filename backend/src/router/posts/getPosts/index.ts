import _ from 'lodash'
import { trpc } from '../../../lib/trpc'
import { zGetPostsTrpcInput } from './input'

export const defaultPosts = [
  { nick: '123', name: 'name12_3', description: 'descr_565756765_3' },
  { nick: '124', name: 'name12_4', description: 'descr_565756765_4' },
  { nick: '125', name: 'name12_5', description: 'descr_565756765_5' },
  { nick: '126', name: 'name12_6', description: 'descr_565756765_6' },
]

export const getPostsTrpcRoute = trpc.procedure.input(zGetPostsTrpcInput).query(async ({ ctx, input }) => {
  const rawPosts = await ctx.prisma.post.findMany({
    select: {
      serialNumber: true,
      id: true,
      nick: true,
      title: true,
      description: true,
      published: true,
      author: true,
      _count: {
        select: {
          postLikes: true,
        },
      },
    },
    where: !input.search
      ? undefined
      : {
          OR: [
            {
              title: input.search,
            },
            {
              nick: input.search,
            },
          ],
        },
    orderBy: [
      {
        createdAt: 'desc',
      },
      {
        serialNumber: 'desc',
      },
    ],
    cursor: input.cursor ? { serialNumber: input.cursor } : undefined,
    take: input.limit + 1,
  })
  const nextPost = rawPosts.at(input.limit)
  const nextCursor = nextPost?.serialNumber
  const rawPostsExceptNext = rawPosts.slice(0, input.limit)
  const postsExceptNext = rawPostsExceptNext.map((post) => ({
    ..._.omit(post, ['_count']),
    likesCount: post._count.postLikes,
  }))
  return { posts: postsExceptNext, nextCursor }
})
