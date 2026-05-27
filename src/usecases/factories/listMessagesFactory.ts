import { PrismaMessageRepository } from "@/repositories/prisma/PrismaMessageRepository";
import { ListMessagesUseCase } from "../messages/ListMessagesUseCase";

export function listMessagesFactory() {
  const messageRepository = new PrismaMessageRepository();
  return new ListMessagesUseCase(messageRepository);
}

