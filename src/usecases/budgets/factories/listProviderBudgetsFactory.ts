import { PrismaBudgetRepository } from "@/repositories/prisma/PrismaBudgetRepository";
import { ListProviderBudgetsUseCase } from "../ListProviderBudgetsUseCase";

export function listProviderBudgetsFactory() {
  const budgetRepository = new PrismaBudgetRepository();
  const listProviderBudgetsUseCase = new ListProviderBudgetsUseCase(
    budgetRepository
  );

  return listProviderBudgetsUseCase;
}
