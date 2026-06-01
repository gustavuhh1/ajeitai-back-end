import { PrismaServiceRepository } from "@/repositories/prisma/PrismaServiceRepository";
import { PrismaCategoryRepository } from "@/repositories/prisma/PrismaCategoryRepository";
import { CreateServiceUseCase } from "../services/CreateServiceUseCase";

import { PrismaAddressRepository } from "@/repositories/prisma/PrismaAddressRepository";

export function createServiceFactory() {
  const serviceRepository = new PrismaServiceRepository();
  const categoryRepository = new PrismaCategoryRepository();
  const addressRepository = new PrismaAddressRepository();
  return new CreateServiceUseCase(serviceRepository, categoryRepository, addressRepository);
}

