import { logger } from '../../../lib/logger'
import { toClientMe } from '../../../lib/models'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zUpdateProfileTrpcInput } from './input'

export const updateProfileTrpcRoute = trpcLoggedProcedure.input(zUpdateProfileTrpcInput).mutation(async ({ ctx, input }) => {
  if (!ctx.me) {
    throw Error('UNAUTHORIZED')
  }
  logger.info('auth', `UpdateProfile:start: nick=${input.nick}`)
  if (ctx.me.nick !== input.nick) {
    try {
      const exUser = await ctx.prisma.user.findUnique({
        where: {
          nick: input.nick,
        },
      })
      if (exUser) throw new Error('Nick is already taken')
    } catch (err) {
      logger.info('auth', `UpdateProfile:Error: ${err}`)
    }
  }

  const updatedMe = await ctx.prisma.user.update({
    where: {
      id: ctx.me.id,
    },
    data: input,
  })
  ctx.me = updatedMe
  return toClientMe(updatedMe)
})
