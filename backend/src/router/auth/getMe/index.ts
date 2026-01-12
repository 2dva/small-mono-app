import { trpc } from '../../../lib/trpc'
import { toClientMe } from '../../../lib/models'

export const getMeTrpcRoute = trpc.procedure.query(({ ctx }) => {
  const meObject = toClientMe(ctx.me)
  return { me: meObject }
})
