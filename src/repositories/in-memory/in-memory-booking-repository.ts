import {Booking, BookingStatus} from '@prisma/client'
import { IBookingRepository, BookingWithPayment } from '../IBookingRepository'

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

    async findById(id: string): Promise<BookingWithPayment | null> {
        const booking = this.items.find((item) => item.id === id)

        if (!booking) {
        return null
        }

        return booking
  }
}