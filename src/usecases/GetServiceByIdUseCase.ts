import { IServiceRepository } from "@/repositories/IServiceRepository";

export class GetServiceByIdUseCase {
    constructor(
        private serviceRepository: IServiceRepository
    ){}

    async execute(id: string) {
        const service = await this.serviceRepository.findByIdWithDetails(id)

        if(!service) {
            throw new Error("Serviço não encontrado")
        }

        return service
    }
}