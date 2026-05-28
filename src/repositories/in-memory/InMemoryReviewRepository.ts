import { Prisma } from '@prisma/client';
import { Review } from '@/entities/Review';
import { IReviewRepository } from '../IReviewRepository';
import crypto from 'crypto';

export class InMemoryReviewRepository implements IReviewRepository {
  public items: Review[] = [];

  async createWithTransaction(data: Prisma.ReviewUncheckedCreateInput): Promise<Review> {
    const review = new Review({
      id: data.id || crypto.randomUUID(),
      serviceId: data.serviceId,
      reviewerId: data.reviewerId,
      reviewedId: data.reviewedId,
      rating: data.rating,
      comment: data.comment || undefined,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    });
    
    this.items.push(review);
    return review;
  }

  async findByServiceId(serviceId: string): Promise<Review | null> {
    const review = this.items.find(r => r.serviceId === serviceId);
    return review || null;
  }
}
