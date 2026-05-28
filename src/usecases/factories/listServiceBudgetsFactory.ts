import { PrismaBudgetRepository } from "@/repositories/prisma/PrismaBudgetRepository";
import { ListServiceBudgetsUseCase } from "../budgets/ListServiceBudgetsUseCase";

export function listServiceBudgetsFactory() {
  const budgetRepository = new PrismaBudgetRepository();
  return new ListServiceBudgetsUseCase(budgetRepository);
}
