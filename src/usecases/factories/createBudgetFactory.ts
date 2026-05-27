import { PrismaBudgetRepository } from "@/repositories/prisma/PrismaBudgetRepository";
import { PrismaServiceRepository } from "@/repositories/prisma/PrismaServiceRepository";
import { CreateBudgetUseCase } from "../budgets/CreateBudgetUseCase";

export function createBudgetFactory() {
  const budgetRepository = new PrismaBudgetRepository();
  const serviceRepository = new PrismaServiceRepository();
  return new CreateBudgetUseCase(budgetRepository, serviceRepository);
}

