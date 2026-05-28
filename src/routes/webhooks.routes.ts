import { Router } from "express";
import { WebhookController } from "@/controllers/payments/WebhookController";

export const webhooksRoutes = Router();
const webhookController = new WebhookController();

// Rota de Webhook do AbacatePay (sem middleware de auth!)
webhooksRoutes.post("/abacatepay", webhookController.handleAbacatePay);
