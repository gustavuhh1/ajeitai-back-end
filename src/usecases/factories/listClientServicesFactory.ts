import { PrismaServiceRepository } from "@/repositories/prisma/PrismaServiceRepository";
import { ListClientServicesUseCase } from "../services/ListClientServicesUseCase";

export function listClientServicesFactory() {
  const serviceRepository = new PrismaServiceRepository();
  const useCase = new ListClientServicesUseCase(serviceRepository);

  return useCase;
}
