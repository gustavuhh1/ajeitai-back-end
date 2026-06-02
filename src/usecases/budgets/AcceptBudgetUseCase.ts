import { IBudgetRepository } from "@/repositories/IBudgetRepository";
import { IServiceRepository } from "@/repositories/IServiceRepository";
import { INotificationService } from "@/services/INotificationService";

interface AcceptBudgetRequest {
  budgetId: string;
  userId: string;
  isFromClient: boolean;
}

export class AcceptBudgetUseCase {
  constructor(
    private budgetRepository: IBudgetRepository,
    private serviceRepository: IServiceRepository,
    private notificationService: INotificationService
  ) {}

  async execute({ budgetId, userId, isFromClient }: AcceptBudgetRequest) {
    const budget = await this.budgetRepository.findById(budgetId);

    if (!budget) {
      throw new Error("Orçamento não encontrado");
    }

    let serviceTitle = "";
    let clientId = "";

    if (isFromClient) {
      const service = await this.serviceRepository.findById(budget.serviceId);
      if (!service) throw new Error("Serviço não encontrado");
      if (service.client_id !== userId) throw new Error("Acesso negado: apenas o criador do serviço pode aceitar o orçamento.");
      
      if (budget.status !== "AGUARDANDO_CLIENTE") {
        throw new Error("Não é possível aceitar este orçamento no momento. Aguardando resposta do prestador.");
      }

      serviceTitle = service.title;
      clientId = service.client_id;
    } else {
      if (budget.providerId !== userId) throw new Error("Acesso negado: apenas o prestador responsável pode aceitar o orçamento.");
      
      if (budget.status !== "AGUARDANDO_PRESTADOR") {
        throw new Error("Não é possível aceitar este orçamento no momento. Aguardando resposta do cliente.");
      }

      const service = await this.serviceRepository.findById(budget.serviceId);
      if (service) {
        serviceTitle = service.title;
        clientId = service.client_id;
      }
    }

    budget.accept();

    await this.budgetRepository.acceptBudget(budgetId, budget.serviceId);

    // Identifica o receptor (se quem aceitou foi o cliente, notifica o prestador, se foi o prestador, notifica o cliente)
    const receiverId = isFromClient ? budget.providerId : clientId;

    if (receiverId) {
      await this.notificationService.dispatch(receiverId, {
        title: "Orçamento Aceito!",
        message: `O orçamento para o serviço "${serviceTitle}" foi aceito.`,
        type: "STATUS_CHANGE",
        link: `/orcamentos/${budget.serviceId}`
      });
    }

    return budget;
  }
}

