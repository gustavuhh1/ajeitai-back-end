import { Router } from "express";
import { ReviewsController } from "@/controllers/ReviewsController";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { ensureRole } from "@/middlewares/ensure-role";

export const reviewsRoutes = Router();
const reviewsController = new ReviewsController();

// Cliente avalia o serviço/prestador após o término
reviewsRoutes.post("/", authMiddleware, ensureRole("CLIENT"), reviewsController.create);
