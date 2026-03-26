import { prisma } from '@/utils/prisma'
import { Budget } from '@/entities/Budget'
import { IBudgetRepository } from './IBudgetRepository'
import { Budget as PrismaBudget } from '@prisma/client'
import {Decimal} from "@prisma/client/runtime/client";

export class PrismaBudgetRepository implements IBudgetRepository {
    async create(budget: Budget) {
        await prisma.budget.create({
            data: {
                id: budget.id,
                price: budget.price,
                description: budget.description,
                estimatedDate: budget.estimatedDate,
                status: budget.status as any,
                serviceId: budget.serviceId,
                providerId: budget.providerId
            }
        })
    }

    async findByServiceId(serviceId: string) {
        const data = await prisma.budget.findMany({
            where: { serviceId: serviceId }
        })

        return data.map((item: PrismaBudget) => new Budget({
            id: item.id,
            serviceId: item.serviceId,
            providerId: item.providerId,
            price: Number(item.price),
            description: item.description,
            estimatedDate: item.estimatedDate,
            status: item.status as any,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        }))
    }
}