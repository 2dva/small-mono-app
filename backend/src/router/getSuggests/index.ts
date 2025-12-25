import { generatePredefinedTreeStrings } from "../../lib/tree"
import { trpc } from "../../lib/trpc"


export const getSudggestsTrpcRoute = trpc.procedure.query(() => {
  console.log(`BACK:TRPC:getSudggests:generating trees`)
  return generatePredefinedTreeStrings()
})
