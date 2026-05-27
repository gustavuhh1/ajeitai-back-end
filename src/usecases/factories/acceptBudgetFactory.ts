import { PrismaBudgetRepository } from "@/repositories/prisma/PrismaBudgetRepository";
import { AcceptBudgetUseCase } from "../budgets/AcceptBudgetUseCase";

export function acceptBudgetFactory() {
  const budgetRepository = new PrismaBudgetRepository();
  return new AcceptBudgetUseCase(budgetRepository);
}

