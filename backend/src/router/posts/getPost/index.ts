import z from 'zod'
import { trpc } from '../../../lib/trpc'
import { defaultPosts } from '../getPosts'

export const getPostTrpcRoute = trpc.procedure.input(z.object({ nick: z.string() })).mutation((req) => {
  const { input } = req
  const id = input.nick
  const post = defaultPosts.find((el) => { return el.nick === id ? true: false})
  console.log(`BACK:TRPC:getPost:post: ${post}`)
  return { post: post || null }
})
