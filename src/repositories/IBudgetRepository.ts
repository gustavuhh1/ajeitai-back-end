import { Budget } from "@/entities/Budget";

export interface IBudgetRepository {
  create(budget: Budget): Promise<void>;
  findManyByServiceIdWithProvider(serviceId: string): Promise<BudgetWithProvider[]>;
  findById(id: string): Promise<Budget | null>;
  acceptBudget(budgetId: string, serviceId: string): Promise<void>;
  update(budget: Budget): Promise<void>;
  findManyByProviderIdWithService(providerId: string): Promise<BudgetWithService[]>;
}

export interface BudgetWithProvider {
  id: string;
  price: number;
  description: string;
  estimatedDate: Date;
  status: string;
  createdAt: Date;
  provider: {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    avgRating: number;
  };
}

export interface BudgetWithService {
  id: string;
  price: number;
  description: string;
  estimatedDate: Date;
  status: string;
  createdAt: Date;
  service: {
    id: string;
    title: string;
    status: string;
    client: {
      name: string;
      image: string | null;
    }
  };
}
