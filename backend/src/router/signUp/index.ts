import crypto from 'crypto'
import { trpc } from '../../lib/trpc'
import { zSignUpTrpcInput } from './input'

export const signUpTrpcRoute = trpc.procedure.input(zSignUpTrpcInput).mutation(async ({ctx, input}) => {
  console.log(`SignUp:signUpTrpcRoute:start: nick=${input.nick}`)
  try {
    const exUser = await ctx.prisma.user.findUnique({
      where: {
        nick: input.nick,
      },
    })
    if (exUser) throw new Error('Already exists')
  } catch(err) {
    console.log(`SignUp:signUpTrpcRoute:Error: ${err}`)
  }

  await ctx.prisma.user.create({
    data: {
      nick: input.nick,
      password: crypto.createHash('sha256').update(input.password).digest('hex')
    }
  })
  console.log(`SignUp:signUpTrpcRoute:end`)
  return true
})
