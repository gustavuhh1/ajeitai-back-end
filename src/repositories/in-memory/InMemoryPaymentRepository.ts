import { Payment } from '@/entities/Payment';
import { IPaymentRepository } from '../IPaymentRepository';

export class InMemoryPaymentRepository implements IPaymentRepository {
  public items: Payment[] = [];

  async create(payment: Payment): Promise<void> {
    this.items.push(payment);
  }
}
