import { Request, Response } from "express";
import { z } from "zod";
import { createPaymentFactory } from "@/usecases/factories/createPaymentFactory";

export class PaymentsController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const bodySchema = z.object({
        method: z.string(),
        amount: z.number().positive(),
        budgetId: z.uuid(),
        transactionId: z.string().optional(),
      });

      const data = bodySchema.parse(req.body);
      const clientId = (req as any).user?.id || "mock-client-id";

      const useCase = createPaymentFactory();
      const payment = await useCase.execute({
        ...data,
        clientId,
      });

      res.status(201).json(payment);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }
}
