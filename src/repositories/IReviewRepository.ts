import {Review, Prisma} from '@prisma/client'

export interface IReviewRepository {
    createWithTransaction(data: Prisma.ReviewUncheckedCreateInput): Promise<Review>
    findByBookingId(bookingId: string): Promise<Review | null>
}