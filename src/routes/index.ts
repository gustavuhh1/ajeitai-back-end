import { Router } from "express";
import { usersRoutes } from "./users.routes";
import { servicesRoutes } from "./services.routes";
import { budgetsRoutes } from "./budgets.routes";
import { messagesRoutes } from "./messages.routes";
import { paymentsRoutes } from "./payments.routes";
import { reviewsRoutes } from "./reviews.routes";
import { addressesRoutes } from "./addresses.routes";
import { notificationsRoutes } from "./notifications.routes";

export const router = Router();

router.use("/", usersRoutes); // Contém /clientes e /prestadores
router.use("/servicos", servicesRoutes);
router.use("/orcamentos", budgetsRoutes);
router.use("/mensagens", messagesRoutes);
router.use("/pagamentos", paymentsRoutes);
router.use("/avaliacoes", reviewsRoutes);
router.use("/enderecos", addressesRoutes);
router.use("/notificacoes", notificationsRoutes);

