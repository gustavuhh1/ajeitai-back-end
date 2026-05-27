import { Review, Prisma } from "@prisma/client";

export interface IReviewRepository {
  createWithTransaction(data: Prisma.ReviewUncheckedCreateInput): Promise<Review>;
  findByServiceId(serviceId: string): Promise<Review | null>;
}