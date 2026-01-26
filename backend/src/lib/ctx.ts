import { createPrismaClient } from './prisma'

export const createAppContext = () => {
  const prisma = createPrismaClient()
  return {
    // тут прописываем контекст чего-либо
    // например из orm или базы данных
    prisma,
    stop: async () => {
      await prisma.$disconnect()
    },
  }
}

export type AppContext = ReturnType<typeof createAppContext>
