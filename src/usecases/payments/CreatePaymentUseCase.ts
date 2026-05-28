import { Payment } from "@/entities/Payment";
import { IPaymentRepository } from "@/repositories/IPaymentRepository";
import { IBudgetRepository } from "@/repositories/IBudgetRepository";
import { abacatePay } from "@/lib/abacatePay";

interface CreatePaymentRequest {
  budgetId: string;
  clientId: string;
}

export class CreatePaymentUseCase {
  constructor(
    private paymentRepository: IPaymentRepository,
    private budgetRepository: IBudgetRepository
  ) {}

  async execute(data: CreatePaymentRequest) {
    const budget = await this.budgetRepository.findById(data.budgetId);

    if (!budget) {
      throw new Error("Orçamento não encontrado.");
    }

    if (budget.status !== "ACEITO" && budget.status !== "AGUARDANDO_CLIENTE") {
      throw new Error("Orçamento inválido para pagamento.");
    }

    // Calcula o valor em centavos + 80 centavos de taxa
    const priceInCents = Math.round(Number(budget.price) * 100);
    const platformFee = 80;
    const finalPrice = priceInCents + platformFee;

    // Gerar fatura no AbacatePay
    const billing = await abacatePay.billing.create({
      frequency: "ONE_TIME",
      methods: ["PIX"],
      products: [
        {
          externalId: budget.id!,
          name: `Orçamento: ${budget.description.substring(0, 50)}...`,
          quantity: 1,
          price: finalPrice,
          description: `Pagamento do serviço prestado pelo app AjeitaAi. Taxa de R$0,80 inclusa.`
        }
      ],
      returnUrl: "http://localhost:3000",
      completionUrl: "http://localhost:3000",
      customerId: data.clientId, // Opcional, para atrelar ao cliente no dashboard
    });

    if (billing.error) {
      throw new Error(`Erro no AbacatePay: ${billing.error}`);
    }

    // O transactionId na API deles costuma vir no data.id e a url em data.url
    const transactionId = billing.data?.id;
    const checkoutUrl = billing.data?.url;

    const payment = new Payment({
      method: "PIX",
      amount: finalPrice / 100, // Salva o valor real cobrado em Reais
      budget_id: data.budgetId,
      client_id: data.clientId,
      transaction_id: transactionId,
      checkoutUrl: checkoutUrl,
    });

    await this.paymentRepository.create(payment);
    return payment;
  }
}
