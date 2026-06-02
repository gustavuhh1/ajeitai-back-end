import { PrismaAddressRepository } from "@/repositories/prisma/PrismaAddressRepository";
import { GetAddressByIdUseCase } from "../addresses/GetAddressByIdUseCase";

export function getAddressByIdFactory() {
  const repository = new PrismaAddressRepository();
  const useCase = new GetAddressByIdUseCase(repository);
  return useCase;
}
