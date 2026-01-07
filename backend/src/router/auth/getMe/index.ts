import _ from 'lodash'
import { trpc } from '../../../lib/trpc'

export const getMeTrpcRoute = trpc.procedure.query(({ ctx }) => {
  const meObject = ctx.me && _.pick(ctx.me, ['id', 'nick'])
  return { me: meObject }
})
