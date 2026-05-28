import { Router } from "express";
import { PaymentsController } from "@/controllers/PaymentsController";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { ensureRole } from "@/middlewares/ensure-role";

export const paymentsRoutes = Router();
const paymentsController = new PaymentsController();

// Cliente realiza o pagamento de um orçamento aceito
paymentsRoutes.post("/", authMiddleware, ensureRole("CLIENT"), paymentsController.create);
