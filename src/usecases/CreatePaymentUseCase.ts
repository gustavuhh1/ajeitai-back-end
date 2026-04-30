import { IBookingRepository } from "@/repositories/IBookingRepository";
import { IPaymentRepository } from "@/repositories/IPaymentRepository";
import { BookingStatus, PaymentsStatus } from "@prisma/client";

interface CreatePaymentRequest {
    bookingId: string
    clientId: string
    amount: number
    method: string
}

export class CreatePaymentUseCase {
    constructor(
        private bookingRepository: IBookingRepository,
        private paymentRepository: IPaymentRepository
    ) {}

    async execute({bookingId, clientId, amount, method}: CreatePaymentRequest) {
        const booking = await this.bookingRepository.findById(bookingId)

        if(!booking) throw new Error("Booking not found")

        if (booking.client_id !== clientId) {
            throw new Error("Forbidden")
        }

        if (booking.status !== BookingStatus.COMPLETED) {
            throw new Error("Booking not completed")
        }

        if (booking.payment) {
            throw new Error('Payment already exists')
        }

        const payment = await this.paymentRepository.create({
            booking_id: bookingId,
            client_id: clientId,
            amount: amount,
            method,
            status: PaymentsStatus.PAID,
            confirmed_payment: true
        })

        return payment
    }
}