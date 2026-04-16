import { ResetToken } from '@/entities/ResetToken'

export interface IResetTokenRepository {
  create(token: ResetToken): Promise<ResetToken>
  findByToken(token: string): Promise<ResetToken | null>
  invalidate(token: string): Promise<void>
}
