import { createPrismaClient } from './prisma'

export const createAppContext = () => {
  return {
    // тут прописываем контекст чего-либо
    // например из orm или базы данных
    prisma: createPrismaClient(),
    stop: async () => {
      await Promise.resolve(0)
    },
  }
}

export type AppContext = ReturnType<typeof createAppContext>
