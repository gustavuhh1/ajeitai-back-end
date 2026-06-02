import { PrismaServiceRepository } from "@/repositories/prisma/PrismaServiceRepository";
import { UpdateServiceUseCase } from "../services/UpdateServiceUseCase";

export function updateServiceFactory() {
  const serviceRepository = new PrismaServiceRepository();
  const useCase = new UpdateServiceUseCase(serviceRepository);

  return useCase;
}
