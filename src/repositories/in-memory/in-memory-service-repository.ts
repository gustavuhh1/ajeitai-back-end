import { Service } from "@/entities/Service";
import { IServiceRepository, ListServicesFilters, ListServicesResponse, ServiceWithDetails } from "../IServiceRepository";

export class InMemoryServiceRepository implements IServiceRepository {
    public items: Service[] = []

    async create(service: Service): Promise<void> {
        this.items.push(service)
    }

    async findAllAvailable({category_id, city, page, limit}: ListServicesFilters): Promise<ListServicesResponse> {
        const filteredItems = this.items.filter(item => {
            const matchesCategory = category_id ? item.category_id === category_id:true
            const matchesCity = city ? item.city.toLowerCase().includes(city.toLowerCase()):true
            const isAvaiable = item.status === 'UNDER_ANALYSIS'
            
            return matchesCategory && matchesCity && isAvaiable
        })

        const start = (page -1) * limit
        const end = start + limit

        return {
            items: filteredItems.slice(start, end),
            total: filteredItems.length
        }
    }

    async findById(id: string): Promise<Service | null> {
        return this.items.find(item=> item.id === id) || null
    }

    async findByIdWithDetails(id: string): Promise<ServiceWithDetails | null> {
        const service = this.items.find(item=> item.id === id)

        if(!service) return null

        return {
            id: service.id,
            title: service.title,
            description: service.description,
            category_id: service.category_id,
            client_id: service.client_id,
            city: service.city,
            status: service.status,
            client: { name: 'Usuário Teste'},
            budgetCount: 0
        } as ServiceWithDetails
    }
}