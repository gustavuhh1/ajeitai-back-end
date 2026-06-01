import { Service } from "@/entities/Service"
import { IServiceRepository } from "@/repositories/IServiceRepository"
import { ICategoryRepository } from "@/repositories/ICategoryRepository"
import { IAddressRepository } from "@/repositories/IAddressRepository"

interface CreateServiceRequest {
    title: string
    description: string
    images_url?: string[]
    categoryIds: string[]
    client_id: string
    address_id: string
}

export class CreateServiceUseCase {
    constructor(
        private serviceRepository: IServiceRepository,
        private categoryRepository: ICategoryRepository,
        private addressRepository: IAddressRepository
    ) {}

    async execute(data: CreateServiceRequest) {
        const categoriesExist = await Promise.all(
            data.categoryIds.map(id => this.categoryRepository.findById(id))
        )

        if (categoriesExist.some(category => !category)) {
            throw new Error("Uma ou mais categorias informadas não foram encontradas")
        }

        const address = await this.addressRepository.findById(data.address_id)
        if (!address) {
            throw new Error("Endereço não encontrado")
        }
        if (address.user_id !== data.client_id) {
            throw new Error("O endereço não pertence a este usuário")
        }

        const service = new Service({
            title: data.title,
            description: data.description,
            images_url: data.images_url ?? [],
            categoryIds: data.categoryIds,
            client_id: data.client_id,
            address_id: data.address_id,
            status: "ABERTO"
        })

        await this.serviceRepository.create(service)
        return service
    }
}
