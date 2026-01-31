import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { logger } from '../lib/logger'
import { createTrcpRouter } from '../lib/trpc'
import { changePasswordTrpcRoute } from './auth/changePassword'
import { getMeTrpcRoute } from './auth/getMe'
import { signInTrpcRoute } from './auth/signIn'
import { signUpTrpcRoute } from './auth/signUp'
import { updateProfileTrpcRoute } from './auth/updateProfile'
import { logSubscriptionTrpcRoute } from './logSubscription'
import { blockPostTrpcRoute } from './posts/blockPost'
import { createPostTrpcRoute } from './posts/createPost'
import { generatePostsTrpcRoute } from './posts/generate'
import { getPostTrpcRoute } from './posts/getPost'
import { getPostsTrpcRoute } from './posts/getPosts'
import { setPostLikeTrpcRoute } from './posts/setPostLike'
import { updatePostTrpcRoute } from './posts/updatePost'
import { getSudggestsTrpcRoute } from './tree/getSuggests'
import { getTreeTrpcRoute } from './tree/getTree'
import { prepareCloudinaryUploadTrpcRoute } from './upload/prepareCloudinaryUpload'

logger.info('back:trpc', `Initializing TRPC`)

export const trpcRouter = createTrcpRouter({
  getMe: getMeTrpcRoute,
  signUp: signUpTrpcRoute,
  signIn: signInTrpcRoute,
  updateProfile: updateProfileTrpcRoute,
  changePassword: changePasswordTrpcRoute,
  getTree: getTreeTrpcRoute,
  getSudggests: getSudggestsTrpcRoute,
  generatePosts: generatePostsTrpcRoute,
  getPosts: getPostsTrpcRoute,
  getPost: getPostTrpcRoute,
  createPost: createPostTrpcRoute,
  updatePost: updatePostTrpcRoute,
  blockPost: blockPostTrpcRoute,
  setPostLike: setPostLikeTrpcRoute,
  onLogAdd: logSubscriptionTrpcRoute,
  prepareCloudinaryUpload: prepareCloudinaryUploadTrpcRoute,
})

export type TrpcRouter = typeof trpcRouter
export type TrpcRouterInput = inferRouterInputs<TrpcRouter>
export type TrpcRouterOutput = inferRouterOutputs<TrpcRouter>
