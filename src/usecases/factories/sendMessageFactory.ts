import { PrismaMessageRepository } from "@/repositories/prisma/PrismaMessageRepository";
import { PrismaBudgetRepository } from "@/repositories/prisma/PrismaBudgetRepository";
import { SendMessageUseCase } from "../messages/SendMessageUseCase";

export function sendMessageFactory() {
  const messageRepository = new PrismaMessageRepository();
  const budgetRepository = new PrismaBudgetRepository();
  return new SendMessageUseCase(messageRepository, budgetRepository);
}

