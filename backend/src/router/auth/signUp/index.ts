import { logger } from '../../../lib/logger'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { getPasswordHash } from '../../../utils/getPasswordHash'
import { signJWT } from '../../../utils/signJWT'
import { zSignUpTrpcInput } from './input'

export const signUpTrpcRoute = trpcLoggedProcedure.input(zSignUpTrpcInput).mutation(async ({ ctx, input }) => {
  logger.info('auth', `SignUp:signUpTrpcRoute:start: nick=${input.nick}`)
    const exUser = await ctx.prisma.user.findUnique({
      where: {
        nick: input.nick,
      },
    })
    if (exUser) throw new Error('User with nick already exists')

    const exUserWithEmail = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    })
    if (exUserWithEmail) throw new Error('User with email already exists')

  const user = await ctx.prisma.user.create({
    data: {
      nick: input.nick,
      email: input.email,
      password: getPasswordHash(input.password),
    },
  })
  const token = signJWT(user.id)
  logger.info('auth', `SignUp:signUpTrpcRoute:end`)
  return { token, userId: user.id }
})
