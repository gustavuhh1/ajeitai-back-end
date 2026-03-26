import { Request, Response } from 'express'
import { z } from 'zod'
import { CreateBudgetUseCase } from '@/usecases/CreateBudgetUseCase'
import { PrismaBudgetRepository } from '@/repositories/PrismaBudgetRepository'
import { PrismaServiceRepository } from '@/repositories/PrismaServiceRepository'

const createBudgetBodySchema = z.object({
    value: z.number().positive()
})

const createBudgetParamsSchema = z.object({
    id: z.string().uuid()
})

export class CreateBudgetController {
    async handle(request: Request, response: Response) {
        try {
            const { value } = createBudgetBodySchema.parse(request.body)
            const { id: service_id } = createBudgetParamsSchema.parse(request.params)

            if (request.user?.role !== 'PROVIDER') {
                return response.status(403).json({ message: "Apenas prestadores podem enviar orçamentos" })
            }

            const budgetRepository = new PrismaBudgetRepository()
            const serviceRepository = new PrismaServiceRepository()
            const useCase = new CreateBudgetUseCase(budgetRepository, serviceRepository)

            const budget = await useCase.execute({ value, service_id })

            return response.status(201).json(budget)
        } catch (error: any) {
            return response.status(400).json({ message: error.message || "Erro ao criar orçamento" })
        }
    }
}