import z from "zod"
import { processTree } from "../../../lib/tree"
import { trpcLoggedProcedure } from "../../../lib/trpc"
import { logger } from "../../../lib/logger"


export const getTreeTrpcRoute = trpcLoggedProcedure
  .input(
    z.object({ stringTree: z.string() })
  )
  .mutation((req) => {
    const { input } = req
    let res = ''
    res = processTree(input.stringTree)
    logger.info('back:trpc', `getTree:Processed tree: ${input.stringTree}`)
    return { tree: res }
  })
