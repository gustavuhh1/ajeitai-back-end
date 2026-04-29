import {prisma} from '@/utils/prisma'
import {Prisma, Review} from '@prisma/client'

export class PrismaReviewRepository {
    async createWithTransaction(data: Prisma.ReviewUncheckedCreateInput): Promise<Review> {
        return await prisma.$transaction(async (tx) => {
            const review = await tx.review.create({data})

            const allReviews = await tx.review.findMany({
                where: {reviewedId: data.reviewedId},
                select: {rating: true}
            })

            const totalRating = allReviews.reduce((sum, item) => sum + item.rating, 0)
            const average = totalRating / allReviews.length

            await tx.user.update({
                where: {id: data.reviewedId},
                data: {avgRating: new Prisma.Decimal(average)}
            })

            return review
        })
    }
}