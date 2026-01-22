import cors from 'cors'
import express from 'express'
import { captureLogs } from './lib/captureLogs'
import { applyTrpcToExpressApp } from './lib/trpc'
import { trpcRouter } from './router'
import { AppContext, createAppContext } from './lib/ctx'
import { applyPassportToExpressApp } from './lib/passport'
import { env } from './lib/env'
import { presetDB } from './scripts/presetDB'
import { applyCron } from './lib/cron'
import { logger } from './lib/logger'

captureLogs()

void (async () => {
  let ctx: AppContext | null = null
  try {
    ctx = createAppContext()
    await presetDB(ctx)
    const expressApp = express()
    expressApp.use(cors())
    applyPassportToExpressApp(expressApp, ctx)
    applyTrpcToExpressApp(expressApp, ctx, trpcRouter)
    applyCron(ctx)
    expressApp.listen(env.PORT, () => {
      logger.info('express', `Listening at http://localhost:${env.PORT}`)
    })
  } catch (error) {
    logger.error('app', error)
    await ctx?.stop()
  }
})()
