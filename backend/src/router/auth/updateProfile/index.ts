import { toClientMe } from '../../../lib/models'
import { trpc } from '../../../lib/trpc'
import { zUpdateProfileTrpcInput } from './input'

export const updateProfileTrpcRoute = trpc.procedure.input(zUpdateProfileTrpcInput).mutation(async ({ ctx, input }) => {
  if (!ctx.me) {
    throw Error('UNAUTHORIZED')
  }
  console.log(`UpdateProfile:start: nick=${input.nick}`)
  if (ctx.me.nick !== input.nick) {
    try {
      const exUser = await ctx.prisma.user.findUnique({
        where: {
          nick: input.nick,
        },
      })
      if (exUser) throw new Error('Nick is already taken')
    } catch (err) {
      console.log(`UpdateProfile:Error: ${err}`)
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
