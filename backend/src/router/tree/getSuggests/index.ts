import { logger } from "../../../lib/logger"
import { generatePredefinedTreeStrings } from "../../../lib/tree"
import { trpcLoggedProcedure } from "../../../lib/trpc"


export const getSudggestsTrpcRoute = trpcLoggedProcedure.query(() => {
  logger.info('back:trpc', `getSudggests:generating trees`)
  return generatePredefinedTreeStrings()
})
