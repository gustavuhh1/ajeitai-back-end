import {Request, Response} from 'express'
import {z, ZodError} from 'zod'
import { ListAvaiableServicesUseCase } from '@/usecases/ListAvaiableServicesUseCase'
import { PrismaServiceRepository } from '@/repositories/PrismaServiceRepository'

const listServicesQuerySchema = z.object({
    category_id: z.string().uuid().optional(),
    city: z.string().optional(),
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10)
})

export class ListAvaiableServicesController {
    async handle(request: Request, response: Response) {
        try {
            const filters = listServicesQuerySchema.parse(request.query)

            if(request.user?.role !== 'PROVIDER') {
                return response.status(403).json({message: "Acesso restrito: apenas prestadores podem buscar serviços"})
            }

            const serviceRespository = new PrismaServiceRepository()
            const useCase = new ListAvaiableServicesUseCase(serviceRespository)

            const result = await useCase.execute(filters)

            return response.status(200).json({result})
        } catch (error: any) {
            return response.status(400).json({
                message: error.message || "Erro ao listar serviços"
            })
        }
    }
}