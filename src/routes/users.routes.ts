import { Router } from "express";
import { UsersController } from "@/controllers/UsersController";

export const usersRoutes = Router();
const usersController = new UsersController();

// Cria uma nova conta para um cliente (contratante)
usersRoutes.post("/clientes", usersController.registerClient);

// Cria uma nova conta para um prestador de serviços
usersRoutes.post("/prestadores", usersController.registerProvider);
