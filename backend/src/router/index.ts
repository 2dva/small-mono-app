import { trpc } from '../lib/trpc'
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

console.log(`Initializing TRPC`)

export const trpcRouter = trpc.router({
  ping: trpc.procedure.query(() => 'Pong!'),
  getMe: getMeTrpcRoute,
  signUp: signUpTrpcRoute,
  signIn: signInTrpcRoute,
  updateProfile: updateProfileTrpcRoute,
  getTree: getTreeTrpcRoute,
  getSudggests: getSudggestsTrpcRoute,
  generatePosts: generatePostsTrpcRoute,
  getPosts: getPostsTrpcRoute,
  getPost: getPostTrpcRoute,
  createPost: createPostTrpcRoute,
  updatePost: updatePostTrpcRoute,
  onLogAdd: logSubscriptionTrpcRoute,
})

export type TrpcRouter = typeof trpcRouter
export type TrpcRouterInput = inferRouterInputs<TrpcRouter>
export type TrpcRouterOutput = inferRouterOutputs<TrpcRouter>
