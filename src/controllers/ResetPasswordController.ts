import { Request, Response } from 'express'
import { z, ZodError } from 'zod'
import {PrismaUserRepository} from "@/repositories/PrismaUserRepository";
import {ResetPasswordUseCase} from "@/usecases/ResetPasswordUseCase";
import {PrismaResetTokenRepository} from "@/repositories/PrismaResetTokenRepository";


const forgotPasswordSchema = z.object({
    password: z.string().min(8, { message: 'A senha deve ter no mínimo 8 caracteres' }),
    token: z.string()
})

export class ResetPasswordController {
    async handle(request: Request, response: Response) {
        try {
            const data = forgotPasswordSchema.parse(request.body)

            const userRepository = new PrismaUserRepository()
            const resetTokenRepository = new PrismaResetTokenRepository()
            const resetPasswordUseCase = new ResetPasswordUseCase(userRepository, resetTokenRepository)

            await resetPasswordUseCase.execute(data)

            return response.status(200).json({ "message": "Senha redefinida com sucesso." })

        } catch (error: any) {
            console.error("Erro detalhado: ", error)
            if (error instanceof ZodError) {
                return response.status(400).json({
                    message: "Erro de validação",
                    issues: error.format()
                })
            }

            return response.status(400).json({
                error: error.message || "Token inválido ou expirado."
            })
        }
    }
}