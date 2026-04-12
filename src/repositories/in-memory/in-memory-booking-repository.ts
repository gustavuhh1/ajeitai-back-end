import {Booking, BookingStatus} from '@prisma/client'
import { IBookingRepository } from '../IBookingRepository'

export class InMemoryBookingRepository implements IBookingRepository {
    public items: any[] = []

    async findManyByProviderId(providerId: string, status?: BookingStatus): Promise<Booking[]> {
        const bookings = this.items.filter((item)=> {
            const matchProvider = item.provider_id === providerId
            const matchStatus = status ? item.status === status: true

            return matchProvider && matchStatus
        })

        return bookings
    }
}