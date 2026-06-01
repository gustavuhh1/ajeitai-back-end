import { PrismaAddressRepository } from "@/repositories/prisma/PrismaAddressRepository";
import { PrismaServiceRepository } from "@/repositories/prisma/PrismaServiceRepository";
import { DeleteAddressUseCase } from "../addresses/DeleteAddressUseCase";

export function deleteAddressFactory() {
  const addressRepository = new PrismaAddressRepository();
  const serviceRepository = new PrismaServiceRepository();
  return new DeleteAddressUseCase(addressRepository, serviceRepository);
}
