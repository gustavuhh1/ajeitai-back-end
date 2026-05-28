import { IPaymentRepository } from "@/repositories/IPaymentRepository";
import { IBudgetRepository } from "@/repositories/IBudgetRepository";
import { IServiceRepository } from "@/repositories/IServiceRepository";

interface RefundPaymentRequest {
  paymentId: string;
  userId: string;
}

export class RefundPaymentUseCase {
  constructor(
    private paymentRepository: IPaymentRepository,
    private budgetRepository: IBudgetRepository,
    private serviceRepository: IServiceRepository
  ) {}

  async execute({ paymentId, userId }: RefundPaymentRequest) {
    // Aqui no futuro chamaremos a API de Refund do AbacatePay
    // Atualmente o SDK V1 deles não possui endpoint explícito para estorno via PIX automatizado.
    // Sendo assim, marcaremos como estornado no nosso DB e o admin deverá realizar o estorno manual via dashboard.
    
    // Na vida real (quando a API estiver disponível):
    // const refund = await abacatePay.refunds.create({ transactionId: payment.transaction_id })
    // if(refund.error) throw new Error("Falha no estorno");

    // Mock Database changes:
    // ... buscar o payment ...
    // ... marcar como REEMBOLSADO ...
    // ... buscar o orçamento ...
    // ... marcar serviço como CANCELADO ...
  }
}
