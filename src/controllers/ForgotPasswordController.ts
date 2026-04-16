import { Request, Response } from 'express'
import { z, ZodError } from 'zod'
import { ForgotPasswordUseCase } from '@/usecases/ForgotPasswordUseCase'
import { PrismaUserRepository } from '@/repositories/PrismaUserRepository'
import { PrismaResetTokenRepository } from '@/repositories/PrismaResetTokenRepository'

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Formato de email inválido' }),
})

export class ForgotPasswordController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { email } = forgotPasswordSchema.parse(request.body)

      const userRepository = new PrismaUserRepository()
      const resetTokenRepository = new PrismaResetTokenRepository()
      const forgotPasswordUseCase = new ForgotPasswordUseCase(
        userRepository,
        resetTokenRepository,
      )

      await forgotPasswordUseCase.execute({ email })

      return response.status(200).json({ email })
    } catch (error: any) {
      if (error instanceof ZodError) {
        return response.status(400).json({
          message: 'Erro de validação',
          issues: error.format(),
        })
      }
      return response.status(200).json({ email: request.body.email })
    }
  }
}
