import { PrismaUserRepository } from "@/repositories/prisma/PrismaUserRepository";
import { RegisterClientUseCase } from "../users/RegisterClientUseCase";

export function registerClientFactory() {
  const userRepository = new PrismaUserRepository();
  return new RegisterClientUseCase(userRepository);
}

