import {
  IServiceRepository,
  ListServicesFilters,
} from "@/repositories/IServiceRepository";

export class ListAvailableServicesUseCase {
  constructor(private serviceRepository: IServiceRepository) {}

  async execute(filters: ListServicesFilters) {
    const { items, total } = await this.serviceRepository.findAllAvailable({
      page: filters.page || 1,
      limit: filters.limit || 10,
      city: filters.city,
      categoryId: filters.categoryId,
    });

    return { items, total };
  }
}
