import { toClientMe } from '../../../lib/models'
import { trpcLoggedProcedure } from '../../../lib/trpc'

export const getMeTrpcRoute = trpcLoggedProcedure.query(({ ctx }) => {
  const meObject = toClientMe(ctx.me)
  return { me: meObject }
})
