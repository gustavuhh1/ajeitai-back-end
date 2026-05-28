import { ResetToken } from '@/entities/ResetToken'
import { IResetTokenRepository } from '../IResetTokenRepository'
import { prisma } from '@/utils/prisma'

export class PrismaResetTokenRepository implements IResetTokenRepository {
  async create(token: ResetToken): Promise<ResetToken> {
    const createdToken = await prisma.resetToken.create({
      data: {
        id: token.id,
        token: token.token,
        expiresAt: token.expiresAt,
        userId: token.userId,
      },
    })
    return new ResetToken(
      createdToken.id,
      createdToken.token,
      createdToken.expiresAt,
      createdToken.userId,
    )
  }

  async findByToken(token: string): Promise<ResetToken | null> {
    const foundToken = await prisma.resetToken.findUnique({
      where: { token },
    })

    if (!foundToken) {
      return null
    }

    return new ResetToken(
      foundToken.id,
      foundToken.token,
      foundToken.expiresAt,
      foundToken.userId,
    )
  }

  async invalidate(token: string): Promise<void> {
    await prisma.resetToken.delete({
      where: { token },
    })
  }
}
