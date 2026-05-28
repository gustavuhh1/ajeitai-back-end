import { PrismaServiceRepository } from "@/repositories/prisma/PrismaServiceRepository";
import { GetServiceDetailsUseCase } from "../services/GetServiceDetailsUseCase";

export function getServiceDetailsFactory() {
  const serviceRepository = new PrismaServiceRepository();
  return new GetServiceDetailsUseCase(serviceRepository);
}

