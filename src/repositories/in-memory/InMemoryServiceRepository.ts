import { Service } from "@/entities/Service";
import {
  IServiceRepository,
  ListServicesFilters,
  ListServicesResponse,
  ServiceWithDetails,
} from "../IServiceRepository";
import { InMemoryUserRepository } from "./InMemoryUserRepository";
import { InMemoryBudgetRepository } from "./InMemoryBudgetRepository";

export class InMemoryServiceRepository implements IServiceRepository {
  public items: Service[] = [];

  // Opcional: referências para outros repos in-memory para popular o `ServiceWithDetails`
  constructor(
    private userRepository?: InMemoryUserRepository,
    private budgetRepository?: InMemoryBudgetRepository,
  ) {}

  async create(service: Service): Promise<void> {
    this.items.push(service);
  }

  async findById(id: string): Promise<Service | null> {
    const service = this.items.find((s) => s.id === id);
    return service || null;
  }

  async findAllAvailable(filters: ListServicesFilters): Promise<ListServicesResponse> {
    let filtered = this.items;

    if (filters.categoryId) {
      // Considerando que service.categoryIds é um array de strings
      filtered = filtered.filter((s) => s.categoryIds.includes(filters.categoryId!));
    }

    if (filters.city) {
      filtered = filtered.filter(
        (s) => s.city.toLowerCase() === filters.city!.toLowerCase(),
      );
    }

    const total = filtered.length;
    const start = (filters.page - 1) * filters.limit;
    const end = start + filters.limit;
    const items = filtered.slice(start, end);

    return { items, total };
  }

  async findByIdWithDetails(id: string): Promise<ServiceWithDetails | null> {
    const service = await this.findById(id);
    if (!service) return null;

    let client = { name: "Client Mock", image: null as string | null };
    if (this.userRepository) {
      const user = this.userRepository.items.find((u) => u.id === service.client_id);
      if (user) client = { name: user.name, image: user.image || null };
    }

    let budgetCount = 0;
    if (this.budgetRepository) {
      budgetCount = this.budgetRepository.items.filter(
        (b) => b.serviceId === service.id,
      ).length;
    }

    return {
      id: service.id,
      title: service.title,
      description: service.description,
      client_id: service.client_id,
      categoryIds: service.categoryIds,
      images_url: service.images_url,
      city: service.city,
      neighborhood: service.neighborhood,
      latitude: service.latitude,
      longitude: service.longitude,
      status: service.status,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
      client,
      budgetCount,
    } as any;
  }
}
