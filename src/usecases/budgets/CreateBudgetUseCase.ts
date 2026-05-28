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
    private serviceRepository: IServiceRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(data: CreateBudgetRequest) {
    const provider = await this.userRepository.findById(data.providerId);
    if (!provider) {
      throw new Error("Prestador não encontrado.");
    }
    
    if (provider.role !== "PROVIDER") {
      throw new Error("Apenas um prestador de serviço pode fazer uma proposta.");
    }

    if (!provider.pixKey) {
      throw new Error("Você precisa configurar sua chave PIX no perfil antes de enviar orçamentos.");
    }

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
