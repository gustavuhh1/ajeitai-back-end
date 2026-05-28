import { prisma } from "@/utils/prisma";
import { IPaymentRepository } from "../IPaymentRepository";
import { Payment } from "@/entities/Payment";
import { Prisma } from "@prisma/client";

export class PrismaPaymentRepository implements IPaymentRepository {
  async create(payment: Payment): Promise<void> {
    await prisma.payment.create({
      data: {
        id: payment.id,
        method: payment.method,
        amount: new Prisma.Decimal(payment.amount),
        status: payment.status as any,
        transaction_id: payment.transaction_id,
        checkoutUrl: payment.checkoutUrl,
        confirmed_payment: payment.confirmed_payment,
        budget_id: payment.budget_id,
        client_id: payment.client_id,
      },
    });
  }

  async findByTransactionId(transactionId: string): Promise<Payment | null> {
    const data = await prisma.payment.findFirst({
      where: { transaction_id: transactionId },
    });

    if (!data) return null;

    return new Payment({
      id: data.id,
      method: data.method,
      amount: data.amount.toNumber(),
      status: data.status as any,
      transaction_id: data.transaction_id,
      checkoutUrl: data.checkoutUrl,
      confirmed_payment: data.confirmed_payment,
      budget_id: data.budget_id,
      client_id: data.client_id,
      createdAt: data.createdAt,
    });
  }

  async update(payment: Payment): Promise<void> {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: payment.status as any,
        transaction_id: payment.transaction_id,
        checkoutUrl: payment.checkoutUrl,
        confirmed_payment: payment.confirmed_payment,
      },
    });
  }
}
