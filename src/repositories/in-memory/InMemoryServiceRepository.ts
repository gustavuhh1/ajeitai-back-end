import { Service } from "@/entities/Service";
import {
  IServiceRepository,
  ListServicesFilters,
  ListServicesResponse,
  ServiceWithDetails,
  ServiceWithCategories,
} from "../IServiceRepository";
import { InMemoryUserRepository } from "./InMemoryUserRepository";
import { InMemoryBudgetRepository } from "./InMemoryBudgetRepository";
import { InMemoryAddressRepository } from "./InMemoryAddressRepository";

export class InMemoryServiceRepository implements IServiceRepository {
  public items: Service[] = [];

  // Opcional: referências para outros repos in-memory para popular o `ServiceWithDetails`
  constructor(
    private userRepository?: InMemoryUserRepository,
    private budgetRepository?: InMemoryBudgetRepository,
    private addressRepository?: InMemoryAddressRepository,
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
      if (this.addressRepository) {
        filtered = filtered.filter((s) => {
          const addr = this.addressRepository!.items.find(a => a.id === s.address_id);
          return addr?.cidade.toLowerCase() === filters.city!.toLowerCase();
        });
      }
    }

    const total = filtered.length;
    const start = (filters.page - 1) * filters.limit;
    const end = start + filters.limit;
    const items = filtered.slice(start, end);

    return { items, total };
  }

  async findAllByUser(userId: string): Promise<ServiceWithCategories[]> {
    return this.items
      .filter((s) => s.client_id === userId)
      .sort((a, b) => {
        const dateA = a.updatedAt ? a.updatedAt.getTime() : 0;
        const dateB = b.updatedAt ? b.updatedAt.getTime() : 0;
        return dateB - dateA;
      })
      .map((s) => {
        return Object.assign(s, {
          categories: s.categoryIds.map(id => ({ id, name: "Categoria Mock" }))
        }) as ServiceWithCategories;
      });
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

    let addressInfo = { rua: "", numero: "", cidade: "", estado: "", latitude: 0, longitude: 0 };
    if (this.addressRepository) {
      const addr = this.addressRepository.items.find((a) => a.id === service.address_id);
      if (addr) {
        addressInfo = {
          rua: addr.rua,
          numero: addr.numero,
          cidade: addr.cidade,
          estado: addr.estado,
          latitude: addr.latitude,
          longitude: addr.longitude,
        };
      }
    }

    return {
      id: service.id,
      title: service.title,
      description: service.description,
      client_id: service.client_id,
      categoryIds: service.categoryIds,
      images_url: service.images_url,
      address_id: service.address_id,
      status: service.status,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
      client,
      budgetCount,
      address: addressInfo,
    } as any;
  }

  async countByAddressId(addressId: string): Promise<number> {
    return this.items.filter(s => s.address_id === addressId).length;
  }
}
