import { prisma } from './prisma'

export const createAppContext = () => {
  return {
    // тут прописываем контекст чего-либо
    // например из orm или базы данных
    prisma,
    stop: async () => {
      await Promise.resolve(0)
    },
  }
}

export type AppContext = ReturnType<typeof createAppContext>
