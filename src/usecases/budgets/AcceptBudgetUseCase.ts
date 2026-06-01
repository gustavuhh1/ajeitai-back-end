import { IBudgetRepository } from "@/repositories/IBudgetRepository";

interface AcceptBudgetRequest {
  budgetId: string;
  serviceId: string;
  isFromClient: boolean;
}

export class AcceptBudgetUseCase {
  constructor(private budgetRepository: IBudgetRepository) {}

  async execute({ budgetId, serviceId, isFromClient }: AcceptBudgetRequest) {
    const budget = await this.budgetRepository.findById(budgetId);

    if (!budget) {
      throw new Error("Orçamento não encontrado");
    }

    if (isFromClient && budget.status !== "AGUARDANDO_CLIENTE") {
      throw new Error("Não é possível aceitar este orçamento no momento. Aguardando resposta do prestador.");
    }

    if (!isFromClient && budget.status !== "AGUARDANDO_PRESTADOR") {
      throw new Error("Não é possível aceitar este orçamento no momento. Aguardando resposta do cliente.");
    }

    budget.accept();

    await this.budgetRepository.acceptBudget(budgetId, serviceId);

    return budget;
  }
}
