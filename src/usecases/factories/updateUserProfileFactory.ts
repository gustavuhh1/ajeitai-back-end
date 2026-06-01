import { PrismaUserRepository } from "@/repositories/prisma/PrismaUserRepository";
import { UpdateUserProfileUseCase } from "../users/UpdateUserProfileUseCase";

export function updateUserProfileFactory() {
  const userRepository = new PrismaUserRepository();
  const useCase = new UpdateUserProfileUseCase(userRepository);

  return useCase;
}
