import { trpc } from '../../../lib/trpc'
import { zSignInTrpcInput } from './input'
import { signJWT } from '../../../utils/signJWT'
import { getPasswordHash } from '../../../utils/getPasswordHash'

export const signInTrpcRoute = trpc.procedure.input(zSignInTrpcInput).mutation(async ({ ctx, input }) => {
  const user = await ctx.prisma.user.findFirst({
    where: {
      nick: input.nick,
      password: getPasswordHash(input.password),
    },
  })
  if (!user) throw Error('Wrong nick or pswd')

  const token = signJWT(user.id)

  return { token }
})
