import { IBudgetRepository } from "@/repositories/IBudgetRepository";
import { IServiceRepository } from "@/repositories/IServiceRepository";

interface AcceptBudgetRequest {
  budgetId: string;
  userId: string;
  isFromClient: boolean;
}

export class AcceptBudgetUseCase {
  constructor(
    private budgetRepository: IBudgetRepository,
    private serviceRepository: IServiceRepository
  ) {}

  async execute({ budgetId, userId, isFromClient }: AcceptBudgetRequest) {
    const budget = await this.budgetRepository.findById(budgetId);

    if (!budget) {
      throw new Error("Orçamento não encontrado");
    }

    if (isFromClient) {
      const service = await this.serviceRepository.findById(budget.serviceId);
      if (!service) throw new Error("Serviço não encontrado");
      if (service.client_id !== userId) throw new Error("Acesso negado: apenas o criador do serviço pode aceitar o orçamento.");
      
      if (budget.status !== "AGUARDANDO_CLIENTE") {
        throw new Error("Não é possível aceitar este orçamento no momento. Aguardando resposta do prestador.");
      }
    } else {
      if (budget.providerId !== userId) throw new Error("Acesso negado: apenas o prestador responsável pode aceitar o orçamento.");
      
      if (budget.status !== "AGUARDANDO_PRESTADOR") {
        throw new Error("Não é possível aceitar este orçamento no momento. Aguardando resposta do cliente.");
      }
    }

    budget.accept();

    await this.budgetRepository.acceptBudget(budgetId, budget.serviceId);

    return budget;
  }
}
