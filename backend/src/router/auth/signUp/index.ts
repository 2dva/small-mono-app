import { trpc } from '../../../lib/trpc'
import { zSignUpTrpcInput } from './input'
import { signJWT } from '../../../utils/signJWT'
import { getPasswordHash } from '../../../utils/getPasswordHash'

export const signUpTrpcRoute = trpc.procedure.input(zSignUpTrpcInput).mutation(async ({ ctx, input }) => {
  console.log(`SignUp:signUpTrpcRoute:start: nick=${input.nick}`)
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
  console.log(`SignUp:signUpTrpcRoute:end`)
  return { token }
})
