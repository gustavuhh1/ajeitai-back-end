import 'dotenv/config'
import { PrismaClient } from "@prisma/client"

import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from 'pg'

console.log(process.env.DATABASE_URL)

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('Iniciando a seed de categorias')

    const categories = [
        { name: 'Limpeza', icon: 'broom' },
        { name: 'Elétrica', icon: 'zap' },
        { name: 'Encanamento', icon: 'droplet' },
        { name: 'Pintura', icon: 'paint-roller' },
        { name: 'Mecânica', icon: 'wrench' }
    ]

    for (const category of categories) {
        await prisma.category.upsert({
            where: {name: category.name},
            update: {},
            create: category
        })
    }
}

main()
    .then(async ()=> {
        console.log('Categorias criadas!')
        await prisma.$disconnect()
    })
    .catch(async (error)=> {
        console.error(error)
        await prisma.$disconnect()
    })