import {Request, Response} from 'express'
import {AcceptBudgetUseCase} from '@/usecases/AcceptBudgetUseCase'
import { PrismaBudgetRepository } from '@/repositories/PrismaBudgetRepository'
import { PrismaServiceRepository } from '@/repositories/PrismaServiceRepository'
import {z, ZodError} from 'zod'

const acceptBudgetPramsSchema = z.object({
    serviceId: z.string().uuid({message: "ID do serviço inválido"}),
    budgetId: z.string().uuid({message: "ID da proposta inválido"})
})

export class AcceptBudgetController {
    async handle(request: Request, response: Response) {
        try {
            const {serviceId, budgetId} = acceptBudgetPramsSchema.parse(request.params)
            
            const clientId = request.user?.id

            if(!clientId) {
                return response.status(401).json({message: "Usuário não autenticado"})
            }

            const budgetRepository = new PrismaBudgetRepository()
            const serviceRepository = new PrismaServiceRepository()
            const acceptBudgetUseCase = new AcceptBudgetUseCase(budgetRepository, serviceRepository)

            const {booking} = await acceptBudgetUseCase.execute({
                clientId,
                serviceId,
                budgetId
            })

            return response.status(200).json({booking})

        } catch (error: any) {
            if (error instanceof ZodError) {
                return response.status(400).json({
                    message: "Erro de validação",
                    issue: error.format()
                })
            }

            if (error.message === 'Forbidden') {
                return response.status(403).json({ message: "Você não tem permissão para aceitar esta proposta." })
            }

            if (error.message === 'Budget not available') {
                return response.status(400).json({ message: "Esta proposta não está mais disponível para aceite." })
            }

            console.error(error)
            return response.status(500).json({
                error: error.message || "Erro interno ao aceitar proposta."
            })
        }
    }
}
