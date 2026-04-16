import { Payment, PaymentsStatus, Prisma } from '@prisma/client'
import { IPaymentRepository } from '../IPaymentRepository'
import { randomUUID } from 'node:crypto'

export class InMemoryPaymentRepository implements IPaymentRepository {
  public items: Payment[] = []

  async create(data: Prisma.PaymentUncheckedCreateInput): Promise<Payment> {
    const payment: Payment = {
      id: data.id ?? randomUUID(),
      method: data.method,
      amount: new Prisma.Decimal(data.amount as number),
      status: (data.status as PaymentsStatus) || PaymentsStatus.PENDING,
      transaction_id: data.transaction_id || null,
      confirmed_payment: data.confirmed_payment || false,
      booking_id: data.booking_id || null,
      client_id: data.client_id,
      createdAt: new Date(),
    }

    this.items.push(payment)

    return payment
  }
}