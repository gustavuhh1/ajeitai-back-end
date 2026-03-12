import {Request, Response} from 'express'
import {CreateUserUseCase} from '@/usecases/CreateUserUseCase'
import {PrismaUserRepository} from '@/repositories/PrismaUserRepository'
import {z} from 'zod'

const createUserSchema = z.object({
    name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres"}),
    email: z.string().email({message: "Formato de email inválido"}),
    password: z.string().min(6, {message: "A senha deve ter no mínimo 6 caracteres"}),
    cpf: z.string().length(11, {message: "O CPF deve ter exatamente 11 dígitos"}),
    role: z.enum(['CLIENT', 'PROVIDER', 'ADMIN']).default('CLIENT')
})

export class CreateUserController {
    async handle(request: Request, response: Response) {
        const data = createUserSchema.parse(request.body)

        const userRepository = new PrismaUserRepository()
        const createUserUseCase = new CreateUserUseCase(userRepository)

        const user = await createUserUseCase.execute(data)

        return response.status(201).json({user})
    }
}