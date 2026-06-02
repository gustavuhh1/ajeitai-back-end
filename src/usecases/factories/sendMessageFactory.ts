import { PrismaMessageRepository } from "@/repositories/prisma/PrismaMessageRepository";
import { PrismaBudgetRepository } from "@/repositories/prisma/PrismaBudgetRepository";
import { PrismaServiceRepository } from "@/repositories/prisma/PrismaServiceRepository";
import { PrismaNotificationRepository } from "@/repositories/prisma/PrismaNotificationRepository";
import { RealTimeNotificationService } from "@/services/RealTimeNotificationService";
import { SendMessageUseCase } from "../messages/SendMessageUseCase";

export function sendMessageFactory() {
  const messageRepository = new PrismaMessageRepository();
  const budgetRepository = new PrismaBudgetRepository();
  const serviceRepository = new PrismaServiceRepository();
  const notificationRepository = new PrismaNotificationRepository();
  const notificationService = new RealTimeNotificationService(notificationRepository);
  
  return new SendMessageUseCase(
    messageRepository, 
    budgetRepository, 
    serviceRepository, 
    notificationService
  );
}


