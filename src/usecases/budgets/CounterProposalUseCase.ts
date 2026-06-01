import { IBudgetRepository } from "@/repositories/IBudgetRepository";
import { IServiceRepository } from "@/repositories/IServiceRepository";

interface CounterProposalRequest {
  budgetId: string;
  userId: string;
  newPrice: number;
  newDate: Date;
  newDescription: string;
  isFromClient: boolean;
}

export class CounterProposalUseCase {
  constructor(
    private budgetRepository: IBudgetRepository,
    private serviceRepository: IServiceRepository
  ) {}

  async execute(data: CounterProposalRequest) {
    const budget = await this.budgetRepository.findById(data.budgetId);

    if (!budget) {
      throw new Error("Orçamento não encontrado");
    }

    if (data.isFromClient) {
      const service = await this.serviceRepository.findById(budget.serviceId);
      if (!service) throw new Error("Serviço não encontrado");
      if (service.client_id !== data.userId) throw new Error("Acesso negado: apenas o criador do serviço pode enviar contraproposta.");

      if (budget.status !== "AGUARDANDO_CLIENTE") {
        throw new Error("Não é possível enviar contraproposta, aguardando resposta do prestador.");
      }
    } else {
      if (budget.providerId !== data.userId) {
        throw new Error("Acesso negado: apenas o prestador responsável pode enviar contraproposta.");
      }

      if (budget.status !== "AGUARDANDO_PRESTADOR") {
        throw new Error("Não é possível enviar contraproposta, aguardando resposta do cliente.");
      }
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
