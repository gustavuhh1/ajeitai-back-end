import { Router } from "express";
import { AddressesController } from "@/controllers/AddressesController";
import { authMiddleware } from "@/middlewares/auth-middleware";

export const addressesRoutes = Router();
const addressesController = new AddressesController();

// Todas as rotas de endereços requerem autenticação
addressesRoutes.use(authMiddleware);

addressesRoutes.post("/", addressesController.create);
addressesRoutes.get("/", addressesController.list);
addressesRoutes.delete("/:id", addressesController.delete);
addressesRoutes.patch("/:id/principal", addressesController.togglePrincipal);
