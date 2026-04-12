import {Request, Response} from 'express'
import {z} from 'zod'
import { BookingStatus } from '@prisma/client'
import { PrismaBookingRepository } from '@/repositories/PrismaBookingRepository'
import { ListProviderBookingsUseCase } from '@/usecases/ListProviderBookingsUseCase'

export class GetProviderBookingsController {
    async handle(request: Request, response: Response) {
        const getProviderBookingsQuerySchema = z.object({
            status: z.nativeEnum(BookingStatus).optional()
        })

        try {
            const {status} = getProviderBookingsQuerySchema.parse(request.query)

            const providerId = request.user?.id

            if (!providerId) {
                return response.status(401).json({message: "Não autorizado"})
            }

            const bookingRepository = new PrismaBookingRepository()
            const listProviderBookingsUseCase = new ListProviderBookingsUseCase(bookingRepository)

            const result = await listProviderBookingsUseCase.execute({
                providerId,
                status
            })

            return response.json(result)
        } catch (error) {
            if(error instanceof z.ZodError) {
                return response.status(400).json({
                    message: 'Erro de validação',
                    errors: error.format()
                })
            }

            console.log(error)
            return response.status(500).json({message: 'Erro interno do servidor'})
        }
    }
}