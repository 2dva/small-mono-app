import z from "zod"
import { processTree } from "../../../lib/tree"
import { trpc } from "../../../lib/trpc"


export const getTreeTrpcRoute = trpc.procedure
  .input(
    z.object({ stringTree: z.string() })
  )
  .mutation((req) => {
    const { input } = req
    let res = ''
    res = processTree(input.stringTree)
    console.log(`BACK:TRPC:getTree:Processed tree: ${input.stringTree}`)
    return { tree: res }
  })
