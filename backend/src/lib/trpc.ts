import { initTRPC } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { TrpcRouter } from '../router'
import { type Express } from 'express'
import { AppContext } from './ctx'
import { ExpressRequest } from '../utils/types'
import { logger } from './logger'


const getCreateTrpcContext = (appContext: AppContext) => {
  return ({ req }: trpcExpress.CreateExpressContextOptions) => ({
    ...appContext,
    me: (req as ExpressRequest).user || null,
  })
}
type TrpcContext = Awaited<ReturnType<typeof getCreateTrpcContext>>


const trpc = initTRPC.context<TrpcContext>().create()

export const createTrcpRouter = trpc.router

export const trpcLoggedProcedure = trpc.procedure.use(
  trpc.middleware(async ({ path, type, next, ctx, getRawInput }) => {
    const start = Date.now()
    const result = await next()
    const durationMs = Date.now() - start
    const meta = {
      path,
      type,
      userId: ctx.me?.id || null,
      durationMs,
      rawInput: (await getRawInput()) || null,
    }
    if (result.ok) {
      logger.info(`trpc:${type}:success`, 'Successfull request', { ...meta, output: result.data })
    } else {
      logger.error(`trpc:${type}:error`, result.error, meta)
    }
    return result
  })
)

export const applyTrpcToExpressApp = (expressApp: Express, appContext: AppContext, trpcRouter: TrpcRouter) => {
  expressApp.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: trpcRouter,
      createContext: getCreateTrpcContext(appContext),
    })
  )
}
