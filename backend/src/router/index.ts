import { trpc } from '../lib/trpc'
import { getTreeTrpcRoute } from './getTree'
import { getSudggestsTrpcRoute } from './getSuggests'
import { getNotesTrpcRoute } from './getNotes'
import { logSubscriptionTrpcRoute } from './logSubscription'
import { signUpTrpcRoute } from './signUp'
import { signInTrpcRoute } from './signIn'
import { getMeTrpcRoute } from './getMe'

console.log(`Initializing TRPC`)

export const trpcRouter = trpc.router({
  ping: trpc.procedure.query(() => 'Pong!'),
  getNotes: getNotesTrpcRoute,
  getMe: getMeTrpcRoute,
  signUp: signUpTrpcRoute,
  signIn: signInTrpcRoute,
  getTree: getTreeTrpcRoute,
  getSudggests: getSudggestsTrpcRoute,
  onLogAdd: logSubscriptionTrpcRoute,
})

export type TrpcRouter = typeof trpcRouter
