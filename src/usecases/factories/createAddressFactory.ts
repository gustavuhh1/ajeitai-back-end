import { PrismaAddressRepository } from "@/repositories/prisma/PrismaAddressRepository";
import { CreateAddressUseCase } from "../addresses/CreateAddressUseCase";

export function createAddressFactory() {
  const addressRepository = new PrismaAddressRepository();
  return new CreateAddressUseCase(addressRepository);
}
