import { IReviewRepository } from "@/repositories/IReviewRepository";
import { IBookingRepository } from "@/repositories/IBookingRepository";
import {BookingStatus} from '@prisma/client'

interface CreateReviewRequest {
    bookingId: string
    reviewerId: string
    rating: number
    comment?: string
}

export class CreateReviewUseCase {
    constructor(
        private reviewRepository: IReviewRepository,
        private bookingRepository: IBookingRepository
    ) {}

    async execute({bookingId, reviewerId, rating, comment}: CreateReviewRequest) {
        const booking = await this.bookingRepository.findById(bookingId)
        if(!booking) {
            throw new Error('Booking not found')
        }

        if(booking.client_id !== reviewerId) {
            throw new Error('Forbidden')
        }

        if(booking.status !== BookingStatus.COMPLETED) {
            throw new Error('Booking not completed')
        }

        const existingReview = await this.reviewRepository.findByBookingId(bookingId)
        if (existingReview) {
            throw new Error('Review already exists')
        }

        const review = await this.reviewRepository.createWithTransaction({
            bookingId,
            reviewerId,
            reviewedId: booking.provider_id,
            rating,
            comment
        })

        return review
    }
}