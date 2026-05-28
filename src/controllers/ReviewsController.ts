import { Request, Response } from 'express';
import { z } from 'zod';
import { createReviewFactory } from '@/usecases/factories/createReviewFactory';

export class ReviewsController {
  async create(req: Request, res: Response): Promise<void> {
    const bodySchema = z.object({
      rating: z.number().min(1).max(5),
      comment: z.string().optional(),
      serviceId: z.uuid(),
      reviewedId: z.uuid(),
    });

    const data = bodySchema.parse(req.body);
    const reviewerId = req.user!.id;

    const useCase = createReviewFactory();
    const review = await useCase.execute({
      ...data,
      reviewerId
    });

    res.status(201).json(review);
  }
}