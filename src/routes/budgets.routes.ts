import { Router } from "express";
import { BudgetsController } from "@/controllers/BudgetsController";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { ensureRole } from "@/middlewares/ensure-role";

export const budgetsRoutes = Router();
const budgetsController = new BudgetsController();

// Retorna todos os orçamentos enviados pelo prestador
budgetsRoutes.get("/me", authMiddleware, ensureRole("PROVIDER"), budgetsController.listMyBudgets);

// Prestador envia o primeiro orçamento para um serviço
budgetsRoutes.post("/", authMiddleware, ensureRole("PROVIDER"), budgetsController.create);

// Prestador e cliente pode atualiza um orçamento com um novo valor/proposta
budgetsRoutes.patch(
  "/:id/contra-proposta",
  authMiddleware,
  budgetsController.counterProposal,
);

// Cliente ou Prestador aceita um orçamento dependendo do status
budgetsRoutes.patch(
  "/:id/aceitar",
  authMiddleware,
  budgetsController.accept,
);

// Retorna todos os orçamentos vinculados a um serviço
budgetsRoutes.get("/:serviceId", authMiddleware, budgetsController.listServiceBudgets);
