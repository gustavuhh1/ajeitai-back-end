import { Service } from "@/entities/Service";
import { IServiceRepository } from "@/repositories/IServiceRepository";
import { ICategoryRepository } from "@/repositories/ICategoryRepository";

interface CreateServiceRequest {
    title: string
    description: string
    category_id: string
    client_id: string
    city: string
    neighborhood?: string
    latitude?: number | null
    longitude?: number | null
}

export class CreateServiceUseCase {
    constructor(
        private serviceRepository: IServiceRepository,
        private categoryRepository: ICategoryRepository
    ) {}

    async execute(request: CreateServiceRequest) {
       const {category_id} = request

        const category = await this.categoryRepository.findById(category_id)
        if(!category) {
            throw new Error("Categoria não encontrada")
        }

        const service = new Service({
            ...request,
            status: 'UNDER_ANALYSIS'
        })

        await this.serviceRepository.create(service)

        return service
    }
}