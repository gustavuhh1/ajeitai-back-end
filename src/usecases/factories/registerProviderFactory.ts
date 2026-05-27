import { PrismaUserRepository } from "@/repositories/prisma/PrismaUserRepository"
import { RegisterProviderUseCase } from "../users/RegisterProviderUseCase"

export function makeRegisterProviderFactory() {
    const userRepository = new PrismaUserRepository()
    return new RegisterProviderUseCase(userRepository)
}

