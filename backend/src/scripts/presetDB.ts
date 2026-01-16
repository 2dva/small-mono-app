import { AppContext } from '../lib/ctx'
import { env } from '../lib/env'
import { getPasswordHash } from '../utils/getPasswordHash'

export const presetDB = async (ctx: AppContext) => {
  await ctx.prisma.user.upsert({
    where: {
      nick: 'admin',
    },
    create: {
      nick: 'admin',
      password: getPasswordHash(env.INITIAL_ADMIN_PASSWORD),
      role: 'CAN_ALL',
    },
    update: {
      role: 'CAN_ALL',
    },
  })
}
