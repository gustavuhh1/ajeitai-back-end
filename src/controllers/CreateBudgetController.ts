import { Request, Response } from 'express'
import { z } from 'zod'
import { CreateBudgetUseCase } from '@/usecases/CreateBudgetUseCase'
import { PrismaBudgetRepository } from '@/repositories/PrismaBudgetRepository'
import { PrismaServiceRepository } from '@/repositories/PrismaServiceRepository'

const createBudgetBodySchema = z.object({
    price: z.number().positive(),
    description: z.string().min(10),
    estimatedDate: z.coerce.date()
})

const createBudgetParamsSchema = z.object({
    id: z.string().uuid()
})

export class CreateBudgetController {
    async handle(request: Request, response: Response) {
        try {
            const { id: serviceId } = createBudgetParamsSchema.parse(request.params)

            const { price, description, estimatedDate } = createBudgetBodySchema.parse(request.body)

            const providerId = request.user?.id

            if (request.user?.role !== 'PROVIDER') {
                return response.status(403).json({ message: "Apenas provedores podem criar um orçamento." })
            }

            const budgetRepository = new PrismaBudgetRepository()
            const serviceRepository = new PrismaServiceRepository()
            const useCase = new CreateBudgetUseCase(budgetRepository, serviceRepository)

            const budget = await useCase.execute({
                price,
                description,
                estimatedDate,
                serviceId,
                providerId: providerId!
            })

            return response.status(201).json(budget)
        } catch (error: any) {
            return response.status(400).json({
                message: error.errors ? error.errors[0].message : error.message
            })
        }
    }
}