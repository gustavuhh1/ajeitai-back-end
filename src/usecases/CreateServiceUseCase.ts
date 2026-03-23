import { Service } from "@/entities/Service";
import { IServiceRepository } from "@/repositories/IServiceRepository";
import { ICategoryRepository } from "@/repositories/ICategoryRepository";

interface CreateServiceRequest {
    title: string
    description: string
    category_id: string
    client_id: string
}

export class CreateServiceUseCase {
    constructor(
        private serviceRepository: IServiceRepository,
        private categoryRepository: ICategoryRepository
    ) {}

    async execute(request: CreateServiceRequest) {
        const {title, description, category_id, client_id} = request

        const category = await this.categoryRepository.findById(category_id)
        if(!category) {
            throw new Error("Categoria não encontrada")
        }

        const service = new Service({
            title,
            description, 
            category_id,
            client_id,
            status: 'UNDER_ANALYSIS'
        })

        await this.serviceRepository.create(service)

        return service
    }
}