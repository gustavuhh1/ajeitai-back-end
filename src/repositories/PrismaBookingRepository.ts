import {Booking, BookingStatus} from '@prisma/client'
import {prisma} from '@/utils/prisma'
import { BookingWithPayment, IBookingRepository } from './IBookingRepository'

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

    async findById(id: string): Promise<BookingWithPayment | null> {
        return await prisma.booking.findUnique({
            where: { id },
            include: {payment: true}
        })
    }

    async save(booking: Booking): Promise<Booking> {
        const updatedBooking = await prisma.booking.update({
            where: {
                id: booking.id,
            },
            data: {
                status: booking.status,
                updatedAt: new Date(),
            }
        })

        return updatedBooking
    }
}