import { Budget } from "@/entities/Budget";

export interface IBudgetRepository {
    create(budget: Budget): Promise<void>
    findByServiceId(serviceId: string): Promise<Budget | null>
}