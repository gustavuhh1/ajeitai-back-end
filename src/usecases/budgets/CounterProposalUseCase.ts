import { IBudgetRepository } from "@/repositories/IBudgetRepository";

interface CounterProposalRequest {
  budgetId: string;
  newPrice: number;
  newDate: Date;
  newDescription: string;
  isFromClient: boolean;
}

export class CounterProposalUseCase {
  constructor(private budgetRepository: IBudgetRepository) {}

  async execute(data: CounterProposalRequest) {
    const budget = await this.budgetRepository.findById(data.budgetId);

    if (!budget) {
      throw new Error("Orçamento não encontrado");
    }

    if (data.isFromClient && budget.status !== "AGUARDANDO_CLIENTE") {
      throw new Error("Não é possível enviar contraproposta, aguardando resposta do prestador.");
    }

    if (!data.isFromClient && budget.status !== "AGUARDANDO_PRESTADOR") {
      throw new Error("Não é possível enviar contraproposta, aguardando resposta do cliente.");
    }

    budget.fazerCotraProposta(
      data.newPrice,
      data.newDate,
      data.newDescription,
      data.isFromClient
    );

    await this.budgetRepository.update(budget);
    return budget;
  }
}
