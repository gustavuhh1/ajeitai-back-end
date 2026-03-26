import { Service } from "@/entities/Service";

export interface ListServicesFilters {
    category_id?: string
    city?: string
    page: number
    limit: number
}

export interface ListServicesResponse {
    items: Service[]
    total: number
}

export type ServiceWithDetails = Service & {
    client: {name: string, avatar_url?: string | null}
    budgetCount: number
}

export interface IServiceRepository {
    create(service: Service): Promise<void>
    findById(id: string): Promise<Service | null>
    findAllAvailable(filters: ListServicesFilters): Promise<ListServicesResponse>
    findByIdWithDetails(id:string): Promise<ServiceWithDetails | null>
}