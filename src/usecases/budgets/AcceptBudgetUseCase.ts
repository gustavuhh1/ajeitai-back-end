import { IBudgetRepository } from "@/repositories/IBudgetRepository";

interface AcceptBudgetRequest {
  budgetId: string;
  serviceId: string;
}

export class AcceptBudgetUseCase {
  constructor(private budgetRepository: IBudgetRepository) {}

  async execute({ budgetId, serviceId }: AcceptBudgetRequest) {
    const budget = await this.budgetRepository.findById(budgetId);

    if (!budget) {
      throw new Error("Orçamento não encontrado");
    }

    budget.accept();

    await this.budgetRepository.acceptBudget(budgetId, serviceId);

    return budget;
  }
}
