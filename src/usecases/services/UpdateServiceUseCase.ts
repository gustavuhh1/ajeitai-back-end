import { IServiceRepository } from "@/repositories/IServiceRepository";

interface UpdateServiceRequest {
  userId: string;
  serviceId: string;
  title?: string;
  description?: string;
  images_url?: string[];
  address_id?: string;
}

export class UpdateServiceUseCase {
  constructor(private serviceRepository: IServiceRepository) {}

  async execute({
    userId,
    serviceId,
    title,
    description,
    images_url,
    address_id,
  }: UpdateServiceRequest): Promise<void> {
    const service = await this.serviceRepository.findById(serviceId);

    if (!service) {
      throw new Error("Serviço não encontrado");
    }

    // Verifica se é o autor do serviço
    if (service.client_id !== userId) {
      throw new Error("Apenas o criador do serviço pode editá-lo");
    }

    // Verifica se o serviço está em aberto
    if (service.status !== "ABERTO") {
      throw new Error("Apenas serviços em aberto podem ser editados");
    }

    // Valida descrição
    if (description !== undefined && description.length < 100) {
      throw new Error("A descrição deve conter no mínimo 100 caracteres");
    }

    //
    if (images_url !== undefined && images_url.length === 0) {
      throw new Error("É necessário fornecer no mínimo 1 imagem");
    }

    await this.serviceRepository.update(serviceId, {
      title,
      description,
      images_url,
      address_id,
    });
  }
}
