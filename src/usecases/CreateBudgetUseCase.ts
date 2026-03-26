import { Budget } from "@/entities/Budget";
import { IBudgetRepository } from "@/repositories/IBudgetRepository";
import { IServiceRepository } from "@/repositories/IServiceRepository";

interface CreateBudgetRequest {
    value: number
    service_id: string
}

export class CreateBudgetUseCase {
    constructor(
        private budgetRepository: IBudgetRepository,
        private serviceRepository: IServiceRepository
    ) {}

    async execute({ value, service_id }: CreateBudgetRequest) {
        const service = await this.serviceRepository.findById(service_id)
        if (!service) {
            throw new Error("Serviço não encontrado")
        }

        const budgetAlreadyExists = await this.budgetRepository.findByServiceId(service_id)
        if (budgetAlreadyExists) {
            throw new Error("Este serviço já possui um orçamento cadastrado")
        }

        const budget = new Budget({ value, service_id })

        await this.budgetRepository.create(budget)

        return budget
    }
}