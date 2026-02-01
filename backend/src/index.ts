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
import debug from 'debug'
import { applyServeWebApp } from './lib/serveWebApp'

captureLogs()

void (async () => {
  let ctx: AppContext | null = null
  try {
    // uncommented to see error messages
    debug.enable(env.DEBUG!)
    ctx = createAppContext()
    await presetDB(ctx)
    const expressApp = express()
    expressApp.use(cors())
    applyPassportToExpressApp(expressApp, ctx)
    applyTrpcToExpressApp(expressApp, ctx, trpcRouter)
    await applyServeWebApp(expressApp)
    applyCron(ctx)

    expressApp.use((error: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error('express', error)
      if (res.headersSent) {
        next(error)
        return
      }
      res.status(500).send('Internal server error')
    })
    
    expressApp.listen(env.PORT, () => {
      logger.info('express', `Listening at http://localhost:${env.PORT}`)
    })
  } catch (error) {
    logger.error('app', error)
    await ctx?.stop()
  }
})()
