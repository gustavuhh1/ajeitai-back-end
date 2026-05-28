import { Message } from "@/entities/Message";
import { IMessageRepository } from "@/repositories/IMessageRepository";
import { IBudgetRepository } from "@/repositories/IBudgetRepository";

interface SendMessageRequest {
  text?: string;
  imageUrl?: string;
  senderId: string;
  budgetId: string;
}

export class SendMessageUseCase {
  constructor(
    private messageRepository: IMessageRepository,
    private budgetRepository: IBudgetRepository
  ) {}

  async execute(data: SendMessageRequest) {
    if (!data.text && !data.imageUrl) {
      throw new Error("A mensagem deve conter texto ou imagem");
    }

    const budget = await this.budgetRepository.findById(data.budgetId);
    if (!budget) {
      throw new Error("Orçamento não encontrado");
    }

    const message = new Message({
      text: data.text ?? null,
      imageUrl: data.imageUrl ?? null,
      senderId: data.senderId,
      budgetId: data.budgetId,
    });

    await this.messageRepository.create(message);
    return message;
  }
}
