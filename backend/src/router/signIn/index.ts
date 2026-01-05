import crypto from 'crypto'
import { trpc } from '../../lib/trpc'
import { zSignInTrpcInput } from './input'

export const signInTrpcRoute = trpc.procedure.input(zSignInTrpcInput).mutation(async ({ctx, input}) => {
  const user = await ctx.prisma.user.findFirst({
    where: {
      nick: input.nick,
      password: crypto.createHash('sha256').update(input.password).digest('hex')
    },
  })
  if (!user) throw Error('Wrong nick or pswd')

  return true
})
