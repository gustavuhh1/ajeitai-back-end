import { Router } from "express";
import { BudgetsController } from "@/controllers/BudgetsController";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { ensureRole } from "@/middlewares/ensure-role";

export const budgetsRoutes = Router();
const budgetsController = new BudgetsController();

// Prestador envia o primeiro orçamento para um serviço
budgetsRoutes.post("/", authMiddleware, ensureRole("PROVIDER"), budgetsController.create);

// Prestador atualiza um orçamento recusado com um novo valor/proposta
budgetsRoutes.patch(
  "/:id/contra-proposta",
  authMiddleware,
  ensureRole("PROVIDER"),
  budgetsController.counterProposal,
);

// Cliente aceita um orçamento enviado por um prestador
budgetsRoutes.patch(
  "/:id/aceitar",
  authMiddleware,
  ensureRole("CLIENT"),
  budgetsController.accept,
);

// Retorna todos os orçamentos vinculados a um serviço
budgetsRoutes.get("/", authMiddleware, budgetsController.listServiceBudgets);
