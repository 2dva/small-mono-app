import { generatePredefinedTreeStrings } from "../../../lib/tree"
import { trpcLoggedProcedure } from "../../../lib/trpc"


export const getSudggestsTrpcRoute = trpcLoggedProcedure.query(() => {
  console.log(`BACK:TRPC:getSudggests:generating trees`)
  return generatePredefinedTreeStrings()
})
