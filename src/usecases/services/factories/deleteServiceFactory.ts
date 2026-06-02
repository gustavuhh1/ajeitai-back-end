import { PrismaServiceRepository } from "@/repositories/prisma/PrismaServiceRepository";
import { PrismaBudgetRepository } from "@/repositories/prisma/PrismaBudgetRepository";
import { PrismaNotificationRepository } from "@/repositories/prisma/PrismaNotificationRepository";
import { RealTimeNotificationService } from "@/services/RealTimeNotificationService";
import { DeleteServiceUseCase } from "../DeleteServiceUseCase";

export function deleteServiceFactory() {
  const serviceRepository = new PrismaServiceRepository();
  const budgetRepository = new PrismaBudgetRepository();
  const notificationRepository = new PrismaNotificationRepository();
  const notificationService = new RealTimeNotificationService(notificationRepository);
  const useCase = new DeleteServiceUseCase(
    serviceRepository, 
    budgetRepository, 
    notificationService
  );

  return useCase;
}

