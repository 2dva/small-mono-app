import _ from 'lodash'
import { trpc } from '../../../lib/trpc'
import { randomBytes } from 'crypto'

const DEFAULT_POSTS_NUMBER = 3
let counter = 0
async function generatePost(ctx: any) {
  counter++
  const hash = Buffer.from(randomBytes(2)).toString('hex')
  const newPost = {
    nick: `cool-post-${hash}-${counter}`,
    title: `Post ${counter}`,
    description: `Description of post number ${counter}`,
    content: _.times(10, (j: number) => `<p>Text Paragraph ${j} of post ${counter}...</p>`).join(''),
    authorId: ctx.me.id
  }
  console.log(`BACK:TRPC:posts: generating post ${newPost}`)

  await ctx.prisma.post.create({
    data: newPost,
  })
}

export const generatePostsTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  if (!ctx.me) {
    throw Error('UNAUTHORIZED')
  }

  const cnt = await ctx.prisma.post.count()
  counter = cnt

  _.times(DEFAULT_POSTS_NUMBER, () => {
    generatePost(ctx)
  })
  return true
})
