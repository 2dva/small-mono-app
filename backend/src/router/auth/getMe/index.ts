import { toClientMe } from '../../../lib/models'
import { trpc } from '../../../lib/trpc'

export const getMeTrpcRoute = trpc.procedure.query(({ ctx }) => {
  const meObject = toClientMe(ctx.me)
  return { me: meObject }
})
