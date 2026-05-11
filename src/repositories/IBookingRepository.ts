import {Booking, BookingStatus, Prisma} from '@prisma/client'

export type BookingWithPayment = Prisma.BookingGetPayload<{
    include: {payment: true}
}>

export interface IBookingRepository {
    findManyByProviderId(
        providerId: string,
        status?: BookingStatus
    ): Promise<Booking[]>

    findById(id: string): Promise<BookingWithPayment | null>

    save(booking: Booking): Promise<Booking>
}