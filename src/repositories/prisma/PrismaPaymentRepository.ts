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
        confirmed_payment: payment.confirmed_payment,
        budget_id: payment.budget_id,
        client_id: payment.client_id,
      },
    });
  }
}
