import { IServiceRepository } from "@/repositories/IServiceRepository";

interface GetServiceDetailsRequest {
  serviceId: string;
}

export class GetServiceDetailsUseCase {
  constructor(private serviceRepository: IServiceRepository) {}

  async execute({ serviceId }: GetServiceDetailsRequest) {
    const service = await this.serviceRepository.findByIdWithDetails(serviceId);

    if (!service) {
      throw new Error("Serviço não encontrado");
    }

    return service;
  }
}
