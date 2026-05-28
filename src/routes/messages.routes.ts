import { Router } from "express";
import { MessagesController } from "@/controllers/MessagesController";
import { authMiddleware } from "@/middlewares/auth-middleware";

export const messagesRoutes = Router();
const messagesController = new MessagesController();

// Envia uma nova mensagem no chat de um orçamento
messagesRoutes.post("/", authMiddleware, messagesController.send);

// Lista todas as mensagens trocadas em um determinado orçamento
messagesRoutes.get("/:budgetId", authMiddleware, messagesController.list);
