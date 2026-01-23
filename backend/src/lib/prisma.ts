import 'dotenv/config'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../prisma/client'

export const createPrismaClient = () => {
  const connectionString = `${process.env.DATABASE_URL}`

  const adapter = new PrismaBetterSqlite3({ url: connectionString })
  const prisma = new PrismaClient({ adapter })

  return prisma
}
