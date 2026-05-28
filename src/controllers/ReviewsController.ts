import { Request, Response } from 'express';
import { z } from 'zod';
import { createReviewFactory } from '@/usecases/factories/createReviewFactory';

export class ReviewsController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const bodySchema = z.object({
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
        serviceId: z.uuid(),
        reviewedId: z.uuid(),
      });

      const data = bodySchema.parse(req.body);
      const reviewerId = (req as any).user?.id || "mock-reviewer-id";

      const useCase = createReviewFactory();
      const review = await useCase.execute({
        ...data,
        reviewerId
      });

      res.status(201).json(review);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }
}
