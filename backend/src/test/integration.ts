// import { omit } from '@small-mono-app/shared/src/omit'
import _ from 'lodash'
import { createAppContext } from '../lib/ctx'
import { env } from '../lib/env'
import { getTrpcContext } from '../lib/trpc'
import { PostModel as Post, UserModel as User } from '../prisma/models'
import { trpcRouter } from '../router'
import { deepMap } from '../utils/deepMap'
import { getPasswordHash } from '../utils/getPasswordHash'
import { type ExpressRequest } from '../utils/types'

if (env.NODE_ENV !== 'test') {
  throw new Error('Run integration tests only with NODE_ENV=test')
}

export const appContext = createAppContext()

afterAll(appContext.stop)

beforeEach(async () => {
  await appContext.prisma.postLike.deleteMany()
  await appContext.prisma.post.deleteMany()
  await appContext.prisma.user.deleteMany()
})

export const getTrpcCaller = (user?: User) => {
  const req = { user } as ExpressRequest
  return trpcRouter.createCaller(getTrpcContext({ appContext, req }))
}

export const withoutNoize = (input: any): any => {
  return deepMap(input, ({ value }) => {
    if (_.isObject(value) && !_.isArray(value)) {
      return _.entries(value).reduce((acc, [objectKey, objectValue]: [string, any]) => {
        if ([/^id$/, /Id$/, /At$/, /^url$/].some((regex) => regex.test(objectKey))) {
          return acc
        }
        return {
          ...acc,
          [objectKey]: objectValue,
        }
      }, {})
    }
    return value
  })
}

export const createUser = async ({ user = {}, number = 1 }: { user?: Partial<User>; number?: number } = {}) => {
  return await appContext.prisma.user.create({
    data: {
      nick: `user${number}`,
      email: `user${number}@example.com`,
      password: getPasswordHash(user.password || '1234'),
      ..._.omit(user, ['password']),
    },
  })
}

export const createPost = async ({
  post = {},
  author,
  number = 1,
}: {
  post?: Partial<Post>
  author: Pick<User, 'id'>
  number?: number
}) => {
  return await appContext.prisma.post.create({
    data: {
      nick: `post${number}`,
      authorId: author.id,
      title: `Post ${number}`,
      description: `Post ${number} description`,
      content: `Post ${number} text text text text text text text text text text text text text text text text text text text text text`,
      ...post,
    },
  })
}

export const createPostWithAuthor = async ({
  author,
  post,
  number,
}: {
  author?: Partial<User>
  post?: Partial<Post>
  number?: number
} = {}) => {
  const createdUser = await createUser({ user: author, number })
  const createdPost = await createPost({ post, author: createdUser, number })
  return {
    author: createdUser,
    post: createdPost,
  }
}

export const createPostLike = async ({
  post,
  liker,
  createdAt,
}: {
  post: Pick<Post, 'id'>
  liker: Pick<User, 'id'>
  createdAt?: Date
}) => {
  return await appContext.prisma.postLike.create({
    data: {
      postId: post.id,
      userId: liker.id,
      createdAt,
    },
  })
}
