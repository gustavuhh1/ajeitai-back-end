import { Payment } from "@/entities/Payment";
import { IPaymentRepository } from "@/repositories/IPaymentRepository";

interface CreatePaymentRequest {
  method: string;
  amount: number;
  budgetId: string;
  clientId: string;
  transactionId?: string;
}

export class CreatePaymentUseCase {
  constructor(private paymentRepository: IPaymentRepository) {}

  async execute(data: CreatePaymentRequest) {
    const payment = new Payment({
      method: data.method,
      amount: data.amount,
      budget_id: data.budgetId,
      client_id: data.clientId,
      transaction_id: data.transactionId,
    });

    // Se vier com transactionId, podemos assumir que já foi pago
    if (data.transactionId) {
      payment.processSuccess(data.transactionId);
    }

    await this.paymentRepository.create(payment);
    return payment;
  }
}
