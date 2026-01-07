import { trpc } from '../lib/trpc'
import { logSubscriptionTrpcRoute } from './logSubscription'
import { signUpTrpcRoute } from './auth/signUp'
import { signInTrpcRoute } from './auth/signIn'
import { getMeTrpcRoute } from './auth/getMe'
import { getTreeTrpcRoute } from './tree/getTree'
import { getSudggestsTrpcRoute } from './tree/getSuggests'
import { getNotesTrpcRoute } from './posts/getNotes'
import { generatePostsTrpcRoute } from './posts/generate'

console.log(`Initializing TRPC`)

export const trpcRouter = trpc.router({
  ping: trpc.procedure.query(() => 'Pong!'),
  getNotes: getNotesTrpcRoute,
  getMe: getMeTrpcRoute,
  signUp: signUpTrpcRoute,
  signIn: signInTrpcRoute,
  getTree: getTreeTrpcRoute,
  getSudggests: getSudggestsTrpcRoute,
  generatePosts: generatePostsTrpcRoute,
  onLogAdd: logSubscriptionTrpcRoute,
})

export type TrpcRouter = typeof trpcRouter
