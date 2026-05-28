import { IPaymentRepository } from "@/repositories/IPaymentRepository";
import { IBudgetRepository } from "@/repositories/IBudgetRepository";
import { IServiceRepository } from "@/repositories/IServiceRepository";
// import { abacatePay } from "@/lib/abacatePay"; // Quando precisarmos validar o signature via SDK

export class AbacatePayWebhookUseCase {
  constructor(
    private paymentRepository: IPaymentRepository,
    private budgetRepository: IBudgetRepository,
    private serviceRepository: IServiceRepository
  ) {}

  async execute(event: any) {
    // Validação real da assinatura deve ocorrer no Controller com abacatePay.webhooks.constructEvent()
    
    // Processamos apenas quando o pagamento foi concluído com sucesso
    if (event.event !== "billing.paid") return;

    // O ID da transação (billing id) pode vir em diferentes locais no payload do AbacatePay
    const transactionId = event.data?.billing?.id || event.data?.pixQrCode?.id;

    if (!transactionId) {
        throw new Error("Transação não encontrada no payload do webhook");
    }

    const payment = await this.paymentRepository.findByTransactionId(transactionId);
    if (!payment) {
        // Ignorar pagamento não registrado no nosso banco (pode ser de outro ambiente)
        return;
    }

    // Processa pagamento
    payment.processSuccess(transactionId);
    await this.paymentRepository.update(payment);

    // Atualiza o orçamento para PAGO
    if (payment.budget_id) {
        const budget = await this.budgetRepository.findById(payment.budget_id);
        if (budget) {
            budget.status = "PAGO";
            await this.budgetRepository.update(budget);

            // Atualiza o serviço para EM_ANDAMENTO
            const service = await this.serviceRepository.findById(budget.serviceId);
            if (service) {
                service.status = "EM_ANDAMENTO";
                await this.serviceRepository.update(service);
            }
        }
    }
  }
}
