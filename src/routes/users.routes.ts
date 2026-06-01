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

// Altera a senha do usuário logado
usersRoutes.post("/change-password", authMiddleware, usersController.changePassword);

// Solicita a recuperação de senha (envio de email)
usersRoutes.post("/forget-password", usersController.forgetPassword);

// Redefine a senha utilizando o token de recuperação
usersRoutes.post("/reset-password", usersController.resetPassword);
