import 'dotenv/config'
import {z} from 'zod'

const envSchema = z.object({
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3333),
    NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev')
})

const _env = envSchema.safeParse(process.env)

if(_env.success === false) {
    console.error('Variável de ambiente inválida', _env.error.issues)

    throw new Error('Variável de ambiente inválida')
}

export const env = _env.data


