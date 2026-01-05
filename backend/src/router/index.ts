import { trpc } from '../lib/trpc'
import { getTreeTrpcRoute } from './getTree'
import { getSudggestsTrpcRoute } from './getSuggests'
import { getNotesTrpcRoute } from './getNotes'
import { logSubscriptionTrpcRoute } from './logSubscription'
import { signUpTrpcRoute } from './signUp'

console.log(`Initializing TRPC`)

export const trpcRouter = trpc.router({
  ping: trpc.procedure.query(() => 'Pong!'),
  getNotes: getNotesTrpcRoute,
  signUp: signUpTrpcRoute,
  getTree: getTreeTrpcRoute,
  getSudggests: getSudggestsTrpcRoute,
  onLogAdd: logSubscriptionTrpcRoute,
})

export type TrpcRouter = typeof trpcRouter
