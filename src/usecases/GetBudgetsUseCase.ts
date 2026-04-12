import { IBudgetRepository } from "@/repositories/IBudgetRepository";
import { IServiceRepository } from "@/repositories/IServiceRepository";

interface GetBudgetsRequest {
    serviceId: string;
    userId: string;
}

export class GetBudgetsUseCase {
    constructor(
        private budgetRepository: IBudgetRepository,
        private serviceRepository: IServiceRepository
    ) {}

    async execute({ serviceId, userId }: GetBudgetsRequest) {
        const service = await this.serviceRepository.findById(serviceId);

        if (!service) {
            throw new Error("Serviço não encontrado.");
        }

        if (service.client_id !== userId) {
            throw new Error("Acesso negado: você não é o criador deste serviço.");
        }

        const budgets = await this.budgetRepository.findManyByServiceIdWithProvider(serviceId);

        return budgets;
    }
}