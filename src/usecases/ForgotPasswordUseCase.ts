import { PrismaUserRepository } from '@/repositories/PrismaUserRepository'
import { IResetTokenRepository } from '@/repositories/IResetTokenRepository'
import { ResetToken } from '@/entities/ResetToken'
import { randomUUID, randomBytes, createHash } from 'crypto'

interface ForgotPasswordUseCaseRequest {
  email: string
}

export class ForgotPasswordUseCase {
  constructor(
    private userRepository: PrismaUserRepository,
    private resetTokenRepository: IResetTokenRepository,
  ) {}

  async execute({ email }: ForgotPasswordUseCaseRequest): Promise<void> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      console.log(`User with email ${email} not found.`)
      return
    }

    const token = randomBytes(64).toString('hex');
    const hashedToken = createHash('sha256').update(token).digest('hex')

    const resetToken = new ResetToken(
      randomUUID(),
      hashedToken,
      new Date(Date.now() + 3600000),
      user.id,
    )

    await this.resetTokenRepository.create(resetToken)

    console.log(`Password reset token for ${email}: ${token}`)
  }
}
