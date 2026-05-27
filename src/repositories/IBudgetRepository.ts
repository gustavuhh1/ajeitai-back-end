import { Budget } from "@/entities/Budget";

export interface IBudgetRepository {
  create(budget: Budget): Promise<void>;
  findManyByServiceIdWithProvider(serviceId: string): Promise<BudgetWithProvider[]>;
  findById(id: string): Promise<Budget | null>;
  acceptBudget(budgetId: string, serviceId: string): Promise<void>;
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
  };
}
