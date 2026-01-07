import { trpc } from '../../../lib/trpc'

export const generatePostsTrpcRoute = trpc.procedure.query(() => {
  console.log(`BACK:TRPC:posts:generate`)
  return true
})
