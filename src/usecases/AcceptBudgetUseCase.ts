import { IBudgetRepository } from "@/repositories/IBudgetRepository";
import { IServiceRepository } from "@/repositories/IServiceRepository";

interface AcceptBudgetRequest {
    clientId: string
    serviceId: string
    budgetId: string
}

export class AcceptBudgetUseCase {
    constructor(
        private budgetRepository: IBudgetRepository,
        private serviceRepository: IServiceRepository
    ) {}

    async execute({clientId, serviceId, budgetId}: AcceptBudgetRequest) {
        const budget = await this.budgetRepository.findById(budgetId)

        if (!budget || budget.serviceId !== serviceId) {
            throw new Error('Budget not found')
        }

        if (budget.status !== 'PENDING') {
            throw new Error('Budget not avaiable')
        }

        const service = await this.serviceRepository.findById(serviceId)

        if(!service || service.client_id !== clientId) {
            throw new Error('Forbidden')
        }

        const booking = await this.budgetRepository.acceptBudget(budgetId, serviceId)

        return {booking}
    }
}