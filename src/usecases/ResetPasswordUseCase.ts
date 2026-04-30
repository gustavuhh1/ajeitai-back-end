import { PrismaUserRepository } from '@/repositories/PrismaUserRepository'
import { IResetTokenRepository } from '@/repositories/IResetTokenRepository'

interface ForgotPasswordUseCaseRequest {
    password: string,
    token: string
}

export class ResetPasswordUseCase {
    constructor(
        private userRepository: PrismaUserRepository,
        private resetTokenRepository: IResetTokenRepository,
    ) {}

    async execute({ password, token }: ForgotPasswordUseCaseRequest): Promise<void> {
        await this.userRepository.resetPassword(password, token)
        await this.resetTokenRepository.invalidate(token)
    }
}