import { Request, Response } from "express";
import {z, ZodError} from 'zod'
import { CreatePaymentUseCase } from "@/usecases/CreatePaymentUseCase";
import { PrismaBookingRepository } from "@/repositories/PrismaBookingRepository";
import { PrismaPaymentRepository } from "@/repositories/PrismaPaymentRepository";

const paymentBodySchema = z.object({
    amount: z.number().positive({message: "O valor deve ser maior que zero"}),
    method: z.string().min(1, {message: "O método de pagamento é obrigatório"})
})

const paymentParamsSchema = z.object({
    id: z.string().uuid({message: "ID do agendamento inválido"})
})

export class CreatePaymentController {
    async handle(request: Request, response: Response) {
        try {
            const {id: bookingId} = paymentParamsSchema.parse(request.params)
            const {amount, method} = paymentBodySchema.parse(request.body)
            const clientId = request.user?.id

            if(!clientId) {
                return response.status(401).json({message: "Usuário não autenticado"})
            }

            const bookingRepository = new PrismaBookingRepository()
            const paymentRepository = new PrismaPaymentRepository()
            
            const useCase = new CreatePaymentUseCase(bookingRepository, paymentRepository)

            const payment = await useCase.execute({
                bookingId,
                clientId,
                amount,
                method
            })

            return response.status(201).json(payment)
        } catch (error: any) {
            if (error instanceof ZodError) {
                return response.status(400).json({message: "Erro de validação", issues: error.format()})
            }
            if (error.message === 'Booking not completed') {
                 return response.status(400).json({ message: "O serviço ainda não foi concluído." })
            }

            if (error.message === 'Forbidden') {
                return response.status(403).json({ message: "Você não tem permissão para pagar este agendamento." })
            }
            if (error.message === 'Payment already exists') {
                return response.status(409).json({ message: "Este agendamento já possui um pagamento registrado." })
            }

            return response.status(500).json({ message: "Erro interno ao processar pagamento." })
        }
    }

}