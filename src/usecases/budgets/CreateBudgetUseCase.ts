import { Budget } from "@/entities/Budget";
import { IBudgetRepository } from "@/repositories/IBudgetRepository";
import { IServiceRepository } from "@/repositories/IServiceRepository";
import { INotificationService } from "@/services/INotificationService";

interface CreateBudgetRequest {
  serviceId: string;
  providerId: string;
  price: number;
  description: string;
  estimatedDate: Date;
}

export class CreateBudgetUseCase {
  constructor(
    private budgetRepository: IBudgetRepository,
    private serviceRepository: IServiceRepository,
    private notificationService: INotificationService
  ) {}

  async execute(data: CreateBudgetRequest) {
    const service = await this.serviceRepository.findById(data.serviceId);

    if (!service) {
      throw new Error("Serviço não encontrado");
    }

    if (service.status !== "ABERTO") {
      throw new Error("Não é possível enviar orçamento para um serviço que não está aberto");
    }

    const budget = new Budget({
      serviceId: data.serviceId,
      providerId: data.providerId,
      price: data.price,
      description: data.description,
      estimatedDate: data.estimatedDate,
    });

    await this.budgetRepository.create(budget);

    // Dispara notificação para o cliente dono do serviço
    await this.notificationService.dispatch(service.client_id, {
      title: "Novo orçamento recebido",
      message: `Você recebeu um novo orçamento no serviço "${service.title}" no valor de R$ ${budget.price.toFixed(2)}.`,
      type: "NEW_QUOTE",
      link: `/orcamentos/${service.id}`
    });

    return budget;
  }
}
