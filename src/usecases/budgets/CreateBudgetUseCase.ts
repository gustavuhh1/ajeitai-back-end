import { Budget } from "@/entities/Budget";
import { IBudgetRepository } from "@/repositories/IBudgetRepository";
import { IServiceRepository } from "@/repositories/IServiceRepository";

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
    private serviceRepository: IServiceRepository
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
    return budget;
  }
}
