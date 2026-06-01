import { PrismaBudgetRepository } from "@/repositories/prisma/PrismaBudgetRepository";
import { PrismaServiceRepository } from "@/repositories/prisma/PrismaServiceRepository";
import { AcceptBudgetUseCase } from "../budgets/AcceptBudgetUseCase";

export function acceptBudgetFactory() {
  const budgetRepository = new PrismaBudgetRepository();
  const serviceRepository = new PrismaServiceRepository();
  return new AcceptBudgetUseCase(budgetRepository, serviceRepository);
}

