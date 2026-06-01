import { Router } from "express";
import { UsersController } from "@/controllers/UsersController";
import { authMiddleware } from "@/middlewares/auth-middleware";

export const usersRoutes = Router();
const usersController = new UsersController();

// Cria uma nova conta para um cliente (contratante)
usersRoutes.post("/clientes", usersController.registerClient);

// Cria uma nova conta para um prestador de serviços
usersRoutes.post("/prestadores", usersController.registerProvider);

// Atualiza o perfil do usuário logado (Cliente ou Prestador)
usersRoutes.patch("/perfil", authMiddleware, usersController.updateProfile);
