import {Budget, Booking, BookingStatus, BudgetStatus} from '@prisma/client'
import { IBudgetRepository, BudgetWithProvider } from '../IBudgetRepository'
import { Budget as BudgetEntity } from '@/entities/Budget'
import { randomUUID } from 'node:crypto'

export class InMemoryBudgetRepository implements IBudgetRepository {
    public items: any[] = []
    public bookings: any[] = []

    async findById(id: string): Promise<BudgetEntity | null> {
        const budget = this.items.find(item=>item.id === id)

        if (!budget) return null
        
        return new BudgetEntity({
            id: budget.id,
            serviceId: budget.serviceId,
            providerId: budget.providerId,
            price: budget.price,
            description: budget.description,
            estimatedDate: budget.estimatedDate,
            status: budget.status,
            createdAt: budget.createdAt,
        })
    }

    async acceptBudget(budgetId: string, serviceId: string): Promise<any> {
        const budgetIndex = this.items.findIndex(item => item.id === budgetId)
        if (budgetIndex === -1) throw new Error("Budget not found")

        this.items[budgetIndex].status = 'ACCEPTED' as BudgetStatus
        const acceptedBudget = this.items[budgetIndex]

        this.items.forEach(item => {
            if(item.serviceId === serviceId && item.id !== budgetId) {
                item.status = 'REJECTED' as BudgetStatus
            }
        })

       const booking = {
            id: randomUUID(),
            scheduleAt: acceptedBudget.estimatedDate,
            status: 'SCHEDULED' as BookingStatus,
            service_id: serviceId,
            client_id: 'any-client-id', 
            provider_id: acceptedBudget.providerId,
            budget_id: budgetId,
            provider: { id: acceptedBudget.providerId, name: 'Provider Name' }
        };

        this.bookings.push(booking)
        return booking
    }

    async create(budget: BudgetEntity): Promise<void> {
        this.items.push({
            id: budget.id,
            serviceId: budget.serviceId,
            providerId: budget.providerId,
            price: budget.price,
            description: budget.description,
            estimatedDate: budget.estimatedDate,
            status: budget.status || 'PENDING',
            createdAt: new Date(),
            updatedAt: new Date()
        })
    }

    async findManyByServiceIdWithProvider(serviceId: string): Promise<BudgetWithProvider[]> {
        return this.items
            .filter(item => item.serviceId === serviceId)
            .map(item => ({
                id: item.id,
                price: item.price,
                description: item.description,
                estimatedDate: item.estimatedDate,
                status: item.status,
                createdAt: item.createdAt,
                provider: {
                    id: item.providerId,
                    name: 'Provider Test Name', 
                    description: 'Provider Test Description'
                }
            }))
    }
}