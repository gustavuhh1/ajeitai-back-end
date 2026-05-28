import { Prisma } from "@prisma/client";
import { Review } from "@/entities/Review";

export interface IReviewRepository {
  createWithTransaction(data: Prisma.ReviewUncheckedCreateInput): Promise<Review>;
  findByServiceId(serviceId: string): Promise<Review | null>;
}
