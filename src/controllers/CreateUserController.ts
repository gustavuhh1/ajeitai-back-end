import {Request, Response} from 'express'
import {CreateUserUseCase} from '@/usecases/CreateUserUseCase'
import {PrismaUserRepository} from '@/repositories/PrismaUserRepository'
import {z, ZodError} from 'zod'

const createUserSchema = z.object({
    name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres"}),
    email: z.string().email({message: "Formato de email inválido"}),
    password: z.string().min(8, {message: "A senha deve ter no mínimo 8 caracteres"}),
    cpf: z.string().length(11, {message: "O CPF deve ter exatamente 11 dígitos"}),
    role: z.enum(['CLIENT', 'PROVIDER', 'ADMIN']).default('CLIENT')
})

export class CreateUserController {
    async handle(request: Request, response: Response) {
        try {
            const data = createUserSchema.parse(request.body)

            const userRepository = new PrismaUserRepository()
            const createUserUsecase = new CreateUserUseCase(userRepository)

            const user = await createUserUsecase.execute(data)

            return response.status(201).json({user})

        } catch (error: any) {
             TODO: //personalizar errors e melhorar o erro do zod

             console.error("Erro detalhado: ", error)
            if (error instanceof ZodError) {
                return response.status(400).json({
                    message: "Erro de validação",
                    issues: error.format()
                })
            }

            return response.status(400).json({
                error: error.message || "Erro inesperado ao criar usuário."
            })
        }
    }
}