import { prisma } from '@/utils/prisma'
import { Budget } from '@/entities/Budget'
import { IBudgetRepository, BudgetWithProvider } from './IBudgetRepository'


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

    async findManyByServiceIdWithProvider(serviceId: string): Promise<BudgetWithProvider[]> {
        const budgets = await prisma.budget.findMany({
            where: { serviceId },
            include: {
                provider: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    }
                }
            }
        });

        return budgets.map(item => ({
            id: item.id,
            price: Number(item.price),
            description: item.description,
            estimatedDate: item.estimatedDate,
            status: item.status,
            createdAt: item.createdAt,
            provider: {
                id: item.provider.id,
                name: item.provider.name,
                description: item.provider.description
            }
        }));
    }

}