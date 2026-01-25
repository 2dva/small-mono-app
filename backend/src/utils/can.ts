import { Post, User, UserRole } from '../prisma/client'

type MaybeUser = Pick<User, 'role' | 'id'> | null
type MaybePost = Pick<Post, 'authorId'> | null

export const hasPermission = (user: MaybeUser, role: UserRole) => {
  return user?.role == role || user?.role == 'CAN_ALL' || false
}

export const canBlockPost = (user: MaybeUser) => {
  return hasPermission(user, 'CAN_BLOCK_POST')
}

export const canEditPost = (user: MaybeUser, post: MaybePost) => {
  return !!user && !!post && user?.id === post?.authorId
}
