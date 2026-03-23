import { Service } from "@/entities/Service";

export interface IServiceRepository {
    create(service: Service): Promise<void>
}