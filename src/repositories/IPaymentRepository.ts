import { Prisma, Payment } from "@prisma/client";

export interface IPaymentRepository {
    create(data: Prisma.PaymentUncheckedCreateInput): Promise<Payment>
}