import { Message } from "@/entities/Message";

export interface IMessageRepository {
  create(message: Message): Promise<void>;
  findManyByBudgetId(budgetId: string): Promise<Message[]>;
}
