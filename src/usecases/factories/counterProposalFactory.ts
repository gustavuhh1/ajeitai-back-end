import { PrismaBudgetRepository } from "@/repositories/prisma/PrismaBudgetRepository";
import { PrismaServiceRepository } from "@/repositories/prisma/PrismaServiceRepository";
import { PrismaNotificationRepository } from "@/repositories/prisma/PrismaNotificationRepository";
import { RealTimeNotificationService } from "@/services/RealTimeNotificationService";
import { CounterProposalUseCase } from "../budgets/CounterProposalUseCase";

export function counterProposalFactory() {
  const budgetRepository = new PrismaBudgetRepository();
  const serviceRepository = new PrismaServiceRepository();
  const notificationRepository = new PrismaNotificationRepository();
  const notificationService = new RealTimeNotificationService(notificationRepository);
  return new CounterProposalUseCase(budgetRepository, serviceRepository, notificationService);
}


