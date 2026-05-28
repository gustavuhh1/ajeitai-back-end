import { Payment } from "@/entities/Payment";

export interface IPaymentRepository {
    create(payment: Payment): Promise<void>
}