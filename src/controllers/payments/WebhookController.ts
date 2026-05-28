import { Request, Response } from "express";
import { AbacatePayWebhookUseCase } from "@/usecases/payments/AbacatePayWebhookUseCase";
import { PrismaPaymentRepository } from "@/repositories/prisma/PrismaPaymentRepository";
import { PrismaBudgetRepository } from "@/repositories/prisma/PrismaBudgetRepository";
import { PrismaServiceRepository } from "@/repositories/prisma/PrismaServiceRepository";

export class WebhookController {
  async handleAbacatePay(req: Request, res: Response) {
    try {
      const payload = req.body;
      
      const paymentRepository = new PrismaPaymentRepository();
      const budgetRepository = new PrismaBudgetRepository();
      const serviceRepository = new PrismaServiceRepository();

      const webhookUseCase = new AbacatePayWebhookUseCase(
        paymentRepository,
        budgetRepository,
        serviceRepository
      );

      await webhookUseCase.execute(payload);

      return res.status(200).send("Webhook received");
    } catch (error: any) {
      console.error("Erro no Webhook AbacatePay:", error.message);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
}
