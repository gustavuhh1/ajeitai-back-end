import { PrismaBudgetRepository } from "@/repositories/prisma/PrismaBudgetRepository";
import { PrismaServiceRepository } from "@/repositories/prisma/PrismaServiceRepository";
import { CounterProposalUseCase } from "../budgets/CounterProposalUseCase";

export function counterProposalFactory() {
  const budgetRepository = new PrismaBudgetRepository();
  const serviceRepository = new PrismaServiceRepository();
  return new CounterProposalUseCase(budgetRepository, serviceRepository);
}

