import { PrismaUserRepository } from "@/repositories/prisma/PrismaUserRepository";
import { ChangePasswordUseCase } from "../ChangePasswordUseCase";

export function changePasswordFactory() {
  const usersRepository = new PrismaUserRepository();
  const useCase = new ChangePasswordUseCase(usersRepository);

  return useCase;
}
