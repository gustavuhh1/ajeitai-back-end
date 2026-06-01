import { IServiceRepository } from "@/repositories/IServiceRepository";

interface DeleteServiceRequest {
  userId: string;
  serviceId: string;
}

export class DeleteServiceUseCase {
  constructor(private serviceRepository: IServiceRepository) {}

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

    await this.serviceRepository.delete(serviceId);
  }
}
