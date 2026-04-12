import { Budget } from "@/entities/Budget";

export interface IBudgetRepository {
    create(budget: Budget): Promise<void>
    findManyByServiceIdWithProvider(serviceId: string): Promise<BudgetWithProvider[]>;
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