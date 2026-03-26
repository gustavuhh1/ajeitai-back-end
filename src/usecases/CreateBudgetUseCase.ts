import { Budget } from "@/entities/Budget";
import { IBudgetRepository } from "@/repositories/IBudgetRepository";
import { IServiceRepository } from "@/repositories/IServiceRepository";

interface CreateBudgetRequest {
    serviceId: string
    providerId: string
    price: number
    description: string
    estimatedDate: Date
}

export class CreateBudgetUseCase {
    constructor(
        private budgetRepository: IBudgetRepository,
        private serviceRepository: IServiceRepository
    ) {}

    async execute(request: CreateBudgetRequest) {
        const service = await this.serviceRepository.findById(request.serviceId)
        if (!service) {
            throw new Error("Serviço não encontrado")
        }

        const budget = new Budget(request)

        await this.budgetRepository.create(budget)

        return budget
    }
}