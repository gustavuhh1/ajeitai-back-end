import {PrismaClient} from "@prisma/client"
import {env} from "@/env"
import {PrismaPg} from "@prisma/adapter-pg"
import {Pool} from 'pg'

const connectionString = `${env.DATABASE_URL}`
const pool = new Pool({connectionString})

const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({adapter})