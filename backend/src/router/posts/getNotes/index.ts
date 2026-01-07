import { trpc } from '../../../lib/trpc'

const defaultNotes = [
  { nick: '123', name: 'name5675757', description: 'descr_565756765' },
  { nick: '124', name: 'name5675757', description: 'descr_565756765' },
  { nick: '125', name: 'name5675757', description: 'descr_565756765' },
  { nick: '126', name: 'name5675757', description: 'descr_565756765' },
]

export const getNotesTrpcRoute = trpc.procedure.query(({ ctx }) => {
  // const notes = await ctx.prisma.note.findMany({ select: {id: true, nick:true}})
  // return { notes }
  return { ideas: defaultNotes }
})
