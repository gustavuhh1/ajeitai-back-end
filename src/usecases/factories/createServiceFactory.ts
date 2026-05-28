import { PrismaServiceRepository } from "@/repositories/prisma/PrismaServiceRepository";
import { PrismaCategoryRepository } from "@/repositories/prisma/PrismaCategoryRepository";
import { CreateServiceUseCase } from "../services/CreateServiceUseCase";

export function createServiceFactory() {
  const serviceRepository = new PrismaServiceRepository();
  const categoryRepository = new PrismaCategoryRepository();
  return new CreateServiceUseCase(serviceRepository, categoryRepository);
}

