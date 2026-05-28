import { PrismaBudgetRepository } from "@/repositories/prisma/PrismaBudgetRepository";
import { PrismaServiceRepository } from "@/repositories/prisma/PrismaServiceRepository";
import { CreateBudgetUseCase } from "../budgets/CreateBudgetUseCase";

import { PrismaUserRepository } from "@/repositories/prisma/PrismaUserRepository";

export function createBudgetFactory() {
  const budgetRepository = new PrismaBudgetRepository();
  const serviceRepository = new PrismaServiceRepository();
  const userRepository = new PrismaUserRepository();
  return new CreateBudgetUseCase(budgetRepository, serviceRepository, userRepository);
}

