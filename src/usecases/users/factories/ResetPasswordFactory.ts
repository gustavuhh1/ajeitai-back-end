import { PrismaUserRepository } from "@/repositories/prisma/PrismaUserRepository";
import { ResetPasswordUseCase } from "../ResetPasswordUseCase";

export function resetPasswordFactory() {
  const usersRepository = new PrismaUserRepository();
  const useCase = new ResetPasswordUseCase(usersRepository);

  return useCase;
}
