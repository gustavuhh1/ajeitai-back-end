import { Router } from "express";
import { ServicesController } from "@/controllers/ServicesController";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { ensureRole } from "@/middlewares/ensure-role";

export const servicesRoutes = Router();
const servicesController = new ServicesController();

// Lista todos os serviços disponíveis (aceita filtros por query params)
servicesRoutes.get("/", servicesController.listAvailable);

// Lista todos os serviços criados pelo cliente autenticado
servicesRoutes.get("/me", authMiddleware, servicesController.listMyServices);

// Retorna os detalhes de um serviço específico pelo ID
servicesRoutes.get("/:id", servicesController.getDetails);

// Permite que um cliente crie um novo serviço/solicitação na plataforma
servicesRoutes.post("/", authMiddleware, ensureRole("CLIENT"), servicesController.create);
