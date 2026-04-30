import {Request, Response} from 'express'
import {z} from 'zod'
import { PrismaReviewRepository } from '@/repositories/PrismaReviewRepository'
import { PrismaBookingRepository } from '@/repositories/PrismaBookingRepository'
import { CreateReviewUseCase } from '@/usecases/CreateReviewUseCase'

const reviewBodySchema = z.object({
    bookingId: z.string().uuid({message: "ID do agendamento inválido"}),
    rating: z.number().int().min(1).max(5, {message: "A nota deve ser entre 1 e 5"}),
    comment: z.string().max(500, {message: "O comentário deve ter no máximo 500 caracteres"}).optional()
})

export class CreateReviewController {
    async handle(request: Request, response: Response) {
        try {
            const {bookingId, rating, comment} = reviewBodySchema.parse(request.body)
            const reviewerId = request.user?.id

            if(!reviewerId) {
                return response.status(401).json({message: "Usuário não autenticado"})
            }

            const reviewRepository = new PrismaReviewRepository()
            const bookingRepository = new PrismaBookingRepository()
            const useCase = new CreateReviewUseCase(reviewRepository, bookingRepository)

            const review = await useCase.execute({
                bookingId,
                reviewerId,
                rating,
                comment
            })

            return response.status(201).json({review})
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return response.status(400).json({
                    message: "Erro de validação",
                    errors: error.issues[0]?.message
                })
            }

            if (error.message === 'Booking not found') {
                return response.status(404).json({ message: error.message })
            }

            if (error.message === 'Forbidden') {
                return response.status(403).json({ message: "Você não tem permissão para avaliar este serviço." })
            }

            if (error.message === 'Booking not completed') {
                return response.status(400).json({ message: "O serviço ainda não foi concluído." })
            }

            if (error.message === 'Review already exists') {
                return response.status(409).json({ message: "Você já avaliou este serviço." })
            }

            return response.status(500).json({ message: "Erro interno do servidor" })
            }
    }
}