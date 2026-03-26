import { prisma } from '@/utils/prisma'
import { Budget } from '@/entities/Budget'
import { IBudgetRepository } from './IBudgetRepository'

export class PrismaBudgetRepository implements IBudgetRepository {
    async create(budget: Budget) {
        await prisma.budget.create({
            data: {
                id: budget.id,
                value: budget.value,
                approval: budget.approval,
                service_id: budget.service_id
            }
        })
    }

    async findByServiceId(serviceId: string) {
        const data = await prisma.budget.findUnique({
            where: { service_id: serviceId }
        })

        if (!data) return null

        return new Budget({
            id: data.id,
            value: Number(data.value),
            approval: data.aprovoval,
            service_id: data.service_id
        })
    }
}