import { IBudgetRepository } from "@/repositories/IBudgetRepository";
import { IServiceRepository } from "@/repositories/IServiceRepository";
import { INotificationService } from "@/services/INotificationService";

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
    private serviceRepository: IServiceRepository,
    private notificationService: INotificationService
  ) {}

  async execute(data: CounterProposalRequest) {
    const budget = await this.budgetRepository.findById(data.budgetId);

    if (!budget) {
      throw new Error("Orçamento não encontrado");
    }

    let serviceTitle = "";
    let clientId = "";

    if (data.isFromClient) {
      const service = await this.serviceRepository.findById(budget.serviceId);
      if (!service) throw new Error("Serviço não encontrado");
      if (service.client_id !== data.userId) throw new Error("Acesso negado: apenas o criador do serviço pode enviar contraproposta.");

      if (budget.status !== "AGUARDANDO_CLIENTE") {
        throw new Error("Não é possível enviar contraproposta, aguardando resposta do prestador.");
      }

      serviceTitle = service.title;
      clientId = service.client_id;
    } else {
      if (budget.providerId !== data.userId) {
        throw new Error("Acesso negado: apenas o prestador responsável pode enviar contraproposta.");
      }

      if (budget.status !== "AGUARDANDO_PRESTADOR") {
        throw new Error("Não é possível enviar contraproposta, aguardando resposta do cliente.");
      }

      const service = await this.serviceRepository.findById(budget.serviceId);
      if (service) {
        serviceTitle = service.title;
        clientId = service.client_id;
      }
    }

    budget.fazerCotraProposta(
      data.newPrice,
      data.newDate,
      data.newDescription,
      data.isFromClient
    );

    await this.budgetRepository.update(budget);

    const receiverId = data.isFromClient ? budget.providerId : clientId;

    if (receiverId) {
      await this.notificationService.dispatch(receiverId, {
        title: "Nova Contra-proposta!",
        message: `Uma nova contra-proposta foi enviada para o serviço "${serviceTitle}".`,
        type: "STATUS_CHANGE",
        link: `/orcamentos/${budget.serviceId}`
      });
    }

    return budget;
  }
}

