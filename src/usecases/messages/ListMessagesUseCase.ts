import { IMessageRepository } from "@/repositories/IMessageRepository";

export class ListMessagesUseCase {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(budgetId: string) {
    const messages = await this.messageRepository.findManyByBudgetId(budgetId);
    return messages;
  }
}
