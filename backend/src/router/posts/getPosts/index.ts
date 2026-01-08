import { trpc } from '../../../lib/trpc'

export const defaultPosts = [
  { nick: '123', name: 'name12_3', description: 'descr_565756765_3' },
  { nick: '124', name: 'name12_4', description: 'descr_565756765_4' },
  { nick: '125', name: 'name12_5', description: 'descr_565756765_5' },
  { nick: '126', name: 'name12_6', description: 'descr_565756765_6' },
]

export const getPostsTrpcRoute = trpc.procedure.query(({ ctx }) => {
  // const posts = await ctx.prisma.note.findMany({ select: {id: true, nick:true}})
  return { posts: defaultPosts }
})
