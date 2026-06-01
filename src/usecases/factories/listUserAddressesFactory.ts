import { PrismaAddressRepository } from "@/repositories/prisma/PrismaAddressRepository";
import { ListUserAddressesUseCase } from "../addresses/ListUserAddressesUseCase";

export function listUserAddressesFactory() {
  const addressRepository = new PrismaAddressRepository();
  return new ListUserAddressesUseCase(addressRepository);
}
