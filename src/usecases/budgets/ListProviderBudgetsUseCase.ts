import { IBudgetRepository, BudgetWithService } from "@/repositories/IBudgetRepository";

interface ListProviderBudgetsRequest {
  providerId: string;
}

export class ListProviderBudgetsUseCase {
  constructor(private budgetRepository: IBudgetRepository) {}

  async execute({ providerId }: ListProviderBudgetsRequest): Promise<BudgetWithService[]> {
    const budgets = await this.budgetRepository.findManyByProviderIdWithService(providerId);
    return budgets;
  }
}
