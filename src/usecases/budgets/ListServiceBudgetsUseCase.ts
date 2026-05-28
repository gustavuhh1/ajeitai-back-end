import { IBudgetRepository } from "@/repositories/IBudgetRepository";

export class ListServiceBudgetsUseCase {
  constructor(private budgetRepository: IBudgetRepository) {}

  async execute(serviceId: string) {
    const budgets = await this.budgetRepository.findManyByServiceIdWithProvider(serviceId);
    return budgets;
  }
}
