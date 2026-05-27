import { PrismaServiceRepository } from "@/repositories/prisma/PrismaServiceRepository";
import { ListAvailableServicesUseCase } from "../services/ListAvailableServicesUseCase";

export function listAvailableServicesFactory() {
  const serviceRepository = new PrismaServiceRepository();
  return new ListAvailableServicesUseCase(serviceRepository);
}

