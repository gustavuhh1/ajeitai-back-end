import {IServiceRepository, ListServicesFilters, ListServicesResponse} from '@/repositories/IServiceRepository'

export class ListAvaiableServicesUseCase {
    constructor(
        private serviceRepository: IServiceRepository
    ) {}

    async execute(filters: ListServicesFilters): Promise<ListServicesResponse> {
        const page = filters.page > 0 ? filters.page : 1

        const limit = filters.limit > 0 && filters.limit <= 50 ? filters.limit : 10

        return await this.serviceRepository.findAllAvailable({
            ...filters,
            page,
            limit
        })
    }
}