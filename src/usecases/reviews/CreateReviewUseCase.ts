import { Review } from "@/entities/Review";
import { IReviewRepository } from "@/repositories/IReviewRepository";
import { IServiceRepository } from "@/repositories/IServiceRepository";

interface CreateReviewRequest {
  rating: number;
  comment?: string;
  serviceId: string;
  reviewerId: string;
  reviewedId: string;
}

export class CreateReviewUseCase {
  constructor(
    private reviewRepository: IReviewRepository,
    private serviceRepository: IServiceRepository
  ) {}

  async execute(data: CreateReviewRequest) {
    const service = await this.serviceRepository.findById(data.serviceId);

    if (!service) {
      throw new Error("Serviço não encontrado");
    }

    if (service.status !== "FINALIZADO") {
      throw new Error("Só é possível avaliar serviços finalizados");
    }

    const review = await this.reviewRepository.createWithTransaction({
      rating: data.rating,
      comment: data.comment,
      serviceId: data.serviceId,
      reviewerId: data.reviewerId,
      reviewedId: data.reviewedId,
    });

    return review;
  }
}
