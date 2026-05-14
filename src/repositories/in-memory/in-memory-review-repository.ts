import {Prisma, Review} from '@prisma/client'
import { IReviewRepository } from '../IReviewRepository'
import {randomUUID} from 'node:crypto'
import { InMemoryUserRepository } from './in-memory-user-repository'

export class InMemoryReviewRepository implements IReviewRepository {
    public items: Review[] = []

    constructor(private userRepository: InMemoryUserRepository) {}

    async findByBookingId(bookingId: string): Promise<Review | null> {
        const review = this.items.find((item)=> item.bookingId === bookingId)
        return review || null
    }

    async createWithTransaction(data: Prisma.ReviewUncheckedCreateInput): Promise<Review> {
        const review: Review = {
            id: data.id ?? randomUUID(),
            rating: data.rating,
            comment: data.comment ?? null,
            bookingId: data.bookingId,
            reviewerId: data.reviewerId,
            reviewedId: data.reviewedId,
            createdAt: new Date(),
        }

        this.items.push(review)

        const allReviewsForUser = this.items.filter(
            (item) => item.reviewedId === data.reviewedId
        )

        const sum = allReviewsForUser.reduce((acc, item)=> acc + item.rating, 0)
        const average = sum / allReviewsForUser.length

        const user = this.userRepository.items.find((user)=> user.id === data.reviewedId)

        if (user) {
            user.avgRating = new Prisma.Decimal(average)
        }

        return review
    }
}