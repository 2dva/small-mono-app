import cors from 'cors'
import express from 'express'
import { captureLogs } from './lib/logger'
import { applyTrpcToExpressApp } from './lib/trpc'
import { trpcRouter } from './router'
import { AppContext, createAppContext } from './lib/ctx'
import { applyPassportToExpressApp } from './lib/passport'
import { env } from './lib/env'

captureLogs()

void (async () => {
  let ctx: AppContext | null = null
  try {
    ctx = createAppContext()
    const expressApp = express()
    expressApp.use(cors())
    applyPassportToExpressApp(expressApp, ctx)
    applyTrpcToExpressApp(expressApp, ctx, trpcRouter)
    expressApp.listen(env.PORT, () => {
      console.info(`Listening at http://localhost:${env.PORT}`)
    })
  } catch (error) {
    console.error(error)
    await ctx?.stop()
  }
})()
