import { Service } from "@/entities/Service";

export interface ListServicesFilters {
    categoryId?: string
    city?: string
    page: number
    limit: number
}

export interface ListServicesResponse {
    items: Service[]
    total: number
}

export type ServiceWithDetails = Service & {
    client: {name: string, image?: string | null}
    budgetCount: number
    address: {
        rua: string
        numero: string
        cidade: string
        estado: string
        latitude: number
        longitude: number
    }
}

export type ServiceWithCategories = Service & {
    categories: {
        id: string;
        name: string;
    }[];
}

export interface IServiceRepository {
    create(service: Service): Promise<void>
    findById(id: string): Promise<Service | null>
    findAllAvailable(filters: ListServicesFilters): Promise<ListServicesResponse>
    findAllByUser(userId: string): Promise<ServiceWithCategories[]>
    findByIdWithDetails(id:string): Promise<ServiceWithDetails | null>
    countByAddressId(addressId: string): Promise<number>
    update(id: string, data: Partial<Service>): Promise<void>
}
