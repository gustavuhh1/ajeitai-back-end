import { Service } from "@/entities/Service"
import { IServiceRepository } from "@/repositories/IServiceRepository"
import { ICategoryRepository } from "@/repositories/ICategoryRepository"

interface CreateServiceRequest {
    title: string
    description: string
    images_url?: string[]
    categoryIds: string[]
    client_id: string
    city: string
    neighborhood?: string
    latitude?: number
    longitude?: number
}

export class CreateServiceUseCase {
    constructor(
        private serviceRepository: IServiceRepository,
        private categoryRepository: ICategoryRepository
    ) {}

    async execute(data: CreateServiceRequest) {
        const categoriesExist = await Promise.all(
            data.categoryIds.map(id => this.categoryRepository.findById(id))
        )

        if (categoriesExist.some(category => !category)) {
            throw new Error("Uma ou mais categorias informadas não foram encontradas")
        }

        const service = new Service({
            title: data.title,
            description: data.description,
            images_url: data.images_url ?? [],
            categoryIds: data.categoryIds,
            client_id: data.client_id,
            city: data.city,
            neighborhood: data.neighborhood,
            latitude: data.latitude,
            longitude: data.longitude,
            status: "ABERTO"
        })

        await this.serviceRepository.create(service)
        return service
    }
}
