import { createTrcpRouter } from '../lib/trpc'
import { logSubscriptionTrpcRoute } from './logSubscription'
import { signUpTrpcRoute } from './auth/signUp'
import { signInTrpcRoute } from './auth/signIn'
import { getMeTrpcRoute } from './auth/getMe'
import { getTreeTrpcRoute } from './tree/getTree'
import { getSudggestsTrpcRoute } from './tree/getSuggests'
import { getPostsTrpcRoute } from './posts/getPosts'
import { generatePostsTrpcRoute } from './posts/generate'
import { getPostTrpcRoute } from './posts/getPost'
import { createPostTrpcRoute } from './posts/createPost'
import { updatePostTrpcRoute } from './posts/updatePost'
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { updateProfileTrpcRoute } from './auth/updateProfile'
import { changePasswordTrpcRoute } from './auth/changePassword'
import { setPostLikeTrpcRoute } from './posts/setPostLike'
import { blockPostTrpcRoute } from './posts/blockPost'

console.log(`Initializing TRPC`)

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
})

export type TrpcRouter = typeof trpcRouter
export type TrpcRouterInput = inferRouterInputs<TrpcRouter>
export type TrpcRouterOutput = inferRouterOutputs<TrpcRouter>
