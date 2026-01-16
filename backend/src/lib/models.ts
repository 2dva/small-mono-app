import _ from 'lodash'
import { User } from '../prisma/client'

export const toClientMe = (user: User | null) => {
  return user && _.pick(user, ['id', 'nick', 'name', 'role'])
}
