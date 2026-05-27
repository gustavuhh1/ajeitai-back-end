import { PrismaReviewRepository } from "@/repositories/prisma/PrismaReviewRepository";
import { PrismaServiceRepository } from "@/repositories/prisma/PrismaServiceRepository";
import { CreateReviewUseCase } from "../reviews/CreateReviewUseCase";

export function createReviewFactory() {
  const reviewRepository = new PrismaReviewRepository();
  const serviceRepository = new PrismaServiceRepository();
  return new CreateReviewUseCase(reviewRepository, serviceRepository);
}

