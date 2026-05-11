import { IBookingRepository } from "@/repositories/IBookingRepository";
import { BookingStatus } from "@prisma/client";

interface UpdateBookingStatusRequest {
    bookingId: string
    providerId: string
    newStatus: BookingStatus
}

export class UpdateBookingStatusUseCase {
    constructor(private bookingRepository: IBookingRepository) {}

    async execute({bookingId, providerId, newStatus}: UpdateBookingStatusRequest) {
        const booking = await this.bookingRepository.findById(bookingId)

        if(!booking) {
            throw new Error('Booking not found')
        }

        if(booking.provider_id !== providerId) {
            throw new Error('Forbidden')
        }

        const currentStatus = booking.status

        if(newStatus === BookingStatus.IN_PROGRESS) {
            if(currentStatus !== BookingStatus.SCHEDULED) {
                throw new Error('Invalid status transition')
            }
        } else if (newStatus === BookingStatus.COMPLETED) {
            if(currentStatus !== BookingStatus.IN_PROGRESS) {
                throw new Error('Invalid status transition')
            }
        } else {
            throw new Error('Invalid status transition')
        }

        booking.status = newStatus

        await this.bookingRepository.save(booking)

        return booking
    }
}