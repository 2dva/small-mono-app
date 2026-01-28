import { pick } from '@small-mono-app/shared/src/pick'
import { User } from '../prisma/client'

export const toClientMe = (user: User | null) => {
  return user && pick(user, ['id', 'nick', 'name', 'role', 'avatar'])
}
