import { Router } from "express";
import { NotificationsController } from "@/controllers/NotificationsController";
import { authMiddleware } from "@/middlewares/auth-middleware";

export const notificationsRoutes = Router();
const notificationsController = new NotificationsController();

// Todas as rotas de notificações requerem autenticação
notificationsRoutes.use(authMiddleware);

// Retorna as notificações do usuário logado
notificationsRoutes.get("/", notificationsController.list);

// Marca todas as notificações como lidas
notificationsRoutes.patch("/lidas", notificationsController.markAllAsRead);

// Marca uma notificação específica como lida
notificationsRoutes.patch("/:id/lida", notificationsController.markAsRead);
