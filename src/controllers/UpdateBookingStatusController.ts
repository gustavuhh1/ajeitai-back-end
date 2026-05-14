import {Request, Response} from 'express'
import {z} from 'zod'
import { UpdateBookingStatusUseCase } from '@/usecases/UpdateBookingStatusUseCase'
import { PrismaBookingRepository } from '@/repositories/PrismaBookingRepository'
import { BookingStatus } from '@prisma/client'

const statusParamsSchema = z.object({
    id: z.string().uuid()
})

const statusBodySchema = z.object({
    status: z.enum([BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED], {
        error:() => ({message: "Status deve ser IN_PROGRESS ou COMPLETED"})
    })
})

export class UpdateBookingStatusController {
    async handle(request: Request, response: Response) {
        try {
            const {id: bookingId} = statusParamsSchema.parse(request.params)
            const {status: newStatus} = statusBodySchema.parse(request.body)
            const providerId = request.user?.id

            if(!providerId) {
                return response.status(401).json({message: "Usuário não autenticado"})
            }

            const bookingRepository = new PrismaBookingRepository()
            const useCase = new UpdateBookingStatusUseCase(bookingRepository)
            
            const booking = await useCase.execute({
                bookingId,
                providerId,
                newStatus
            })

            return response.status(200).json({booking})

        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return response.status(400).json({
                    message: "Erro de validação",
                    error: error
                })
            }

            if (error.message === 'Booking not found') {
                return response.status(404).json({ message: error.message })
            }

            if (error.message === 'Forbidden') {
                return response.status(403).json({ message: "Você não tem permissão para atualizar este agendamento." })
            }

            if (error.message === 'Invalid status transition') {
                return response.status(400).json({ message: "Transição de status inválida." })
            }

            return response.status(500).json({message: "Internal server error"})
        }
    }
}