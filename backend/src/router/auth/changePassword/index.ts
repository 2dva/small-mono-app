import { trpc } from '../../../lib/trpc'
import { getPasswordHash } from '../../../utils/getPasswordHash'
import { zChangePasswordTrpcInput } from './input'

export const changePasswordTrpcRoute = trpc.procedure.input(zChangePasswordTrpcInput).mutation(async ({ ctx, input }) => {
  if (!ctx.me) {
    throw Error('UNAUTHORIZED')
  }
  if (ctx.me.password !== getPasswordHash(input.oldPassword)) {
    throw Error('Wrong old password')
  }

  const updatedMe = await ctx.prisma.user.update({
    where: {
      id: ctx.me.id,
    },
    data: {
      password: getPasswordHash(input.newPassword),
    },
  })

  ctx.me = updatedMe

  return true
})
