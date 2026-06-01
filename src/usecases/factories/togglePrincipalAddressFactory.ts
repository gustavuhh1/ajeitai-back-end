import { PrismaAddressRepository } from "@/repositories/prisma/PrismaAddressRepository";
import { TogglePrincipalAddressUseCase } from "../addresses/TogglePrincipalAddressUseCase";

export function togglePrincipalAddressFactory() {
  const addressRepository = new PrismaAddressRepository();
  return new TogglePrincipalAddressUseCase(addressRepository);
}
