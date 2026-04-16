import {BookingStatus} from '@prisma/client'
import { IBookingRepository } from '@/repositories/IBookingRepository'

interface ListProviderBookingsRequest {
    providerId: string
    status?: BookingStatus
}

interface ListProviderBookingsResponse  {
    items: {
        id: string
        scheduleAt: Date
        status: BookingStatus
        service: {
            id: string
            title: string
            location: string
        }
        client: {
            id: string
            name: string
        }
    } []
    total: number
}

export class ListProviderBookingsUseCase {
    constructor(private bookingRepository: IBookingRepository) {}

    async execute({
        providerId,
        status
    }: ListProviderBookingsRequest): Promise<ListProviderBookingsResponse> {
        const bookings = await this.bookingRepository.findManyByProviderId(providerId, status)

        const items = bookings.map((booking: any) => ({
            id: booking.id,
            scheduleAt: booking.scheduleAt,
            status: booking.status,
            service: {
                id: booking.service.id,
                title: booking.service.title,
                location: `${booking.service.neighborhood || ''}${booking.service.neighborhood ? ', ' : ''}${booking.service.city}`,
            },
            client: {
                id: booking.client.id,
                name: booking.client.name,
            },
    }));

    return {
        items,
        total: items.length
    }
    }
}