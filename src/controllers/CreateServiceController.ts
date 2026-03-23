import {Request, Response} from 'express'
import {z, ZodError} from 'zod'
import { CreateServiceUseCase } from '@/usecases/CreateServiceUseCase'
import { PrismaServiceRepository } from '@/repositories/PrismaServiceRepository'
import { PrismaCategoryRepository } from '@/repositories/PrismaCategoryRepository'

const createServiceSchema = z.object({
    title: z.string().min(5, {message: "O título deve ter pelo menos 5 caracteres"}),
    description: z.string().min(10, {message: "A descrição deve ter pelo menos 10 caracteres"}),
    category_id: z.string().uuid({message: "ID de categoria inválido"})
})

export class CreateServiceController {
    async handle(request: Request, response: Response) {
        try {
            const {title, description, category_id} = createServiceSchema.parse(request.body)

            const client_id = request.user?.id

            if(!client_id) {
                return response.status(401).json({message: "Você precisa estar logado para criar um serviço."})
            }

            const serviceRepository = new PrismaServiceRepository()
            const categoryRepository = new PrismaCategoryRepository()
            const useCase = new CreateServiceUseCase(serviceRepository, categoryRepository)

            const service = await useCase.execute({
                title,
                description,
                category_id,
                client_id
            })

            return response.status(201).json({service})
        } catch (error: any) {
            if (error instanceof ZodError) {
                return response.status(400).json({ errors: error.issues[0]?.message})
            }

            return response.status(500).json({message: error.message || "Erro inesperado ao criar um serviço"})
        }
    }
}