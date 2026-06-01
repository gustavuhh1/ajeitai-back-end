import { PrismaServiceRepository } from "@/repositories/prisma/PrismaServiceRepository";
import { DeleteServiceUseCase } from "../DeleteServiceUseCase";

export function deleteServiceFactory() {
  const serviceRepository = new PrismaServiceRepository();
  const useCase = new DeleteServiceUseCase(serviceRepository);

  return useCase;
}
