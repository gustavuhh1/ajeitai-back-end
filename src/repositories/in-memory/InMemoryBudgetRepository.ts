import { Budget } from '@/entities/Budget';
import { IBudgetRepository, BudgetWithProvider } from '../IBudgetRepository';
import { InMemoryUserRepository } from './InMemoryUserRepository';

export class InMemoryBudgetRepository implements IBudgetRepository {
  public items: Budget[] = [];

  constructor(private userRepository?: InMemoryUserRepository) {}

  async create(budget: Budget): Promise<void> {
    this.items.push(budget);
  }

  async findManyByServiceIdWithProvider(serviceId: string): Promise<BudgetWithProvider[]> {
    const budgets = this.items.filter(b => b.serviceId === serviceId);
    
    return budgets.map(b => {
      let providerInfo = {
        id: b.providerId,
        name: 'Provider Mock',
        description: null as string | null,
        image: null as string | null,
        avgRating: 0
      };

      if (this.userRepository) {
        const user = this.userRepository.items.find(u => u.id === b.providerId);
        if (user) {
          providerInfo = {
            id: user.id!,
            name: user.name,
            description: user.description || null,
            image: user.image || null,
            avgRating: 0
          };
        }
      }

      return {
        id: b.id!,
        price: b.price,
        description: b.description,
        estimatedDate: b.estimatedDate,
        status: b.status!,
        createdAt: b.createdAt || new Date(),
        provider: providerInfo
      };
    });
  }

  async findById(id: string): Promise<Budget | null> {
    const budget = this.items.find(b => b.id === id);
    return budget || null;
  }

  async acceptBudget(budgetId: string, serviceId: string): Promise<void> {
    this.items.forEach(b => {
      if (b.serviceId === serviceId) {
        if (b.id === budgetId) {
          b.accept();
        } else {
          b.reject();
        }
      }
    });
  }

  async update(budget: Budget): Promise<void> {
    const index = this.items.findIndex(b => b.id === budget.id);
    if (index !== -1) {
      this.items[index] = budget;
    }
  }

  async findManyByProviderIdWithService(
    providerId: string,
  ): Promise<any[]> {
    return this.items
      .filter((b) => b.providerId === providerId)
      .map((b) => ({
        id: b.id,
        price: b.price,
        description: b.description,
        estimatedDate: b.estimatedDate,
        status: b.status,
        createdAt: b.createdAt,
        service: {
          id: b.serviceId,
          title: "Mock Service Title",
          status: "ABERTO",
          client: {
            name: "Mock Client",
            image: null,
          }
        },
      }));
  }
}
