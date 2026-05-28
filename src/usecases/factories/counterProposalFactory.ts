import { PrismaBudgetRepository } from "@/repositories/prisma/PrismaBudgetRepository";
import { CounterProposalUseCase } from "../budgets/CounterProposalUseCase";

export function counterProposalFactory() {
  const budgetRepository = new PrismaBudgetRepository();
  return new CounterProposalUseCase(budgetRepository);
}

