import { PrismaUserRepository } from "@/repositories/prisma/PrismaUserRepository";
import { ForgotPasswordUseCase } from "../ForgotPasswordUseCase";

export function forgotPasswordFactory() {
  const usersRepository = new PrismaUserRepository();
  const useCase = new ForgotPasswordUseCase(usersRepository);

  return useCase;
}
