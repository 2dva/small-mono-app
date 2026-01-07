import _ from 'lodash'
import { trpc } from '../../../lib/trpc'

const DEFAULT_POSTS_NUMBER = 3
let counter = 0
async function generatePost(ctx: any) {
  counter++
  const newPost = {
    // nick: `cool-post-nick-${counter}`,
    title: `Post ${counter}`,
    // description: `Description of post number ${counter}`,
    content: _.times(10, (j: number) => `<p>Text Paragraph ${j} of post ${counter}...</p>`).join(''),
    authorId: ctx.me.id
  }
  console.log(`BACK:TRPC:posts: inserting post ${newPost}`)

  const post = await ctx.prisma.post.create({
    data: newPost,
  })
}

export const generatePostsTrpcRoute = trpc.procedure.query(async ({ ctx, input }) => {
  if (!ctx.me) {
    throw Error('UNAUTHORIZED')
  }

  _.times(DEFAULT_POSTS_NUMBER, () => {
    generatePost(ctx)
  })
  return true
})
