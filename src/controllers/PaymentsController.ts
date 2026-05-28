import { Request, Response } from "express";
import { z } from "zod";
import { createPaymentFactory } from "@/usecases/factories/createPaymentFactory";

export class PaymentsController {
  async create(req: Request, res: Response): Promise<void> {
    const bodySchema = z.object({
      method: z.string(),
      amount: z.number().positive(),
      budgetId: z.uuid(),
      transactionId: z.string().optional(),
    });

    const data = bodySchema.parse(req.body);
    const clientId = req.user!.id;

    const useCase = createPaymentFactory();
    const payment = await useCase.execute({
      ...data,
      clientId,
    });

    res.status(201).json(payment);
  }
}