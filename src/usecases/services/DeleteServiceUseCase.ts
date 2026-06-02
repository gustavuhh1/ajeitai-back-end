import { IServiceRepository } from "@/repositories/IServiceRepository";
import { IBudgetRepository } from "@/repositories/IBudgetRepository";
import { INotificationService } from "@/services/INotificationService";

interface DeleteServiceRequest {
  userId: string;
  serviceId: string;
}

export class DeleteServiceUseCase {
  constructor(
    private serviceRepository: IServiceRepository,
    private budgetRepository: IBudgetRepository,
    private notificationService: INotificationService
  ) {}

  async execute({ userId, serviceId }: DeleteServiceRequest): Promise<void> {
    const service = await this.serviceRepository.findById(serviceId);

    if (!service) {
      throw new Error("Serviço não encontrado");
    }

    if (service.client_id !== userId) {
      throw new Error("Apenas o autor do serviço pode fazer a exclusão");
    }

    if (service.status !== "ABERTO") {
      throw new Error("Apenas serviços em aberto podem ser excluídos");
    }

    // Busca os orçamentos antes de deletar o serviço
    const budgets = await this.budgetRepository.findManyByServiceIdWithProvider(serviceId);

    await this.serviceRepository.delete(serviceId);

    // Dispara notificação para todos os prestadores que haviam enviado orçamento
    for (const budget of budgets) {
      await this.notificationService.dispatch(budget.provider.id, {
        title: "Serviço Excluído",
        message: `O serviço "${service.title}" foi excluído pelo cliente. Seu orçamento foi cancelado.`,
        type: "SERVICE_DELETED",
        link: null
      });
    }
  }
}

