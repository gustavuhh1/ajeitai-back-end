import {Booking, BookingStatus} from '@prisma/client'
import {prisma} from '@/utils/prisma'
import { IBookingRepository } from './IBookingRepository'

export class PrismaBookingRepository implements IBookingRepository {
    async findManyByProviderId(providerId: string, status?: BookingStatus): Promise<Booking[]> {
        const bookings = await prisma.booking.findMany({
            where: {
                provider_id: providerId,
                ...(status && { status })
            },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                service: {
                    select: {
                        id: true,
                        title: true,
                        neighborhood: true,
                        city: true
                    }
                }
            },
            orderBy: {
                scheduleAt: 'asc'
            }
        })

        return bookings
    }
}