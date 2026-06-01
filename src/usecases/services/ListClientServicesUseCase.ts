import { Service } from "@/entities/Service";
import { IServiceRepository } from "@/repositories/IServiceRepository";

interface ListClientServicesRequest {
  userId: string;
}

export class ListClientServicesUseCase {
  constructor(private serviceRepository: IServiceRepository) {}

  async execute({ userId }: ListClientServicesRequest): Promise<Service[]> {
    if (!userId) {
      throw new Error("ID do usuário é obrigatório.");
    }

    const services = await this.serviceRepository.findAllByUser(userId);

    return services;
  }
}
