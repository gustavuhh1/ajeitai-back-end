import { prisma } from "@/utils/prisma";
import { Message } from "@/entities/Message";
import { IMessageRepository } from "../IMessageRepository";

export class PrismaMessageRepository implements IMessageRepository {
  // Cria uma mensagem no banco de dados
  async create(message: Message): Promise<void> {
    await prisma.message.create({
      data: {
        id: message.id,
        text: message.text,
        imageUrl: message.imageUrl,
        senderId: message.senderId,
        budgetId: message.budgetId,
        createdAt: message.createdAt,
      },
    });
  }

  // Busca as mensagens de um orçamento específico
  async findManyByBudgetId(budgetId: string): Promise<Message[]> {
    const messages = await prisma.message.findMany({
      where: { budgetId },
      orderBy: { createdAt: "asc" },
    });

    return messages.map(
      (m) =>
        new Message({
          id: m.id,
          text: m.text,
          imageUrl: m.imageUrl,
          senderId: m.senderId,
          budgetId: m.budgetId,
          createdAt: m.createdAt,
        }),
    );
  }
}
