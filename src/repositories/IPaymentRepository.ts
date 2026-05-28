import { Payment } from "@/entities/Payment";

export interface IPaymentRepository {
    create(payment: Payment): Promise<void>
    findByTransactionId(transactionId: string): Promise<Payment | null>
    update(payment: Payment): Promise<void>
}