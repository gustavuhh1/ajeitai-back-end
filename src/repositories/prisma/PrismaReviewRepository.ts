import { prisma } from "@/utils/prisma";
import { IReviewRepository } from "../IReviewRepository";
import { Prisma } from "@prisma/client";
import { Review } from "@/entities/Review";

export class PrismaReviewRepository implements IReviewRepository {
  async createWithTransaction(data: Prisma.ReviewUncheckedCreateInput): Promise<Review> {
    return await prisma.$transaction(async (tx) => {
      const reviewData = await tx.review.create({ data });

      const allReviews = await tx.review.findMany({
        where: { reviewedId: data.reviewedId },
        select: { rating: true },
      });

      const totalRating = allReviews.reduce((sum, item) => sum + item.rating, 0);
      const average = totalRating / allReviews.length;

      await tx.user.update({
        where: { id: data.reviewedId },
        data: { avgRating: new Prisma.Decimal(average) },
      });

      const review = new Review(reviewData);

      return review;
    });
  }

  async findByServiceId(serviceId: string): Promise<Review | null> {
    const reviewData = await prisma.review.findUnique({
      where: {
        serviceId,
      },
    });
    if (!reviewData) return null;

    return new Review(reviewData);
  }
}
