import { Message } from '@/entities/Message';
import { IMessageRepository } from '../IMessageRepository';

export class InMemoryMessageRepository implements IMessageRepository {
  public items: Message[] = [];

  async create(message: Message): Promise<void> {
    this.items.push(message);
  }

  async findManyByBudgetId(budgetId: string): Promise<Message[]> {
    return this.items.filter(m => m.budgetId === budgetId);
  }
}
