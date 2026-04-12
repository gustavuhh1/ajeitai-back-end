import {Booking, BookingStatus} from '@prisma/client'

export interface IBookingRepository {
    findManyByProviderId(
        providerId: string,
        status?: BookingStatus
    ): Promise<Booking[]>
}