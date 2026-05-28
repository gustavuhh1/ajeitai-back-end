import express from "express";
import { router } from "@/routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./utils/swagger";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth/auth";

export const app = express();

app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(router);

