// src/controllers/ListServiceBudgetsController.ts
import { Request, Response } from 'express';
import { z } from 'zod';
import { GetBudgetsUseCase } from '@/usecases/GetBudgetsUseCase';
import { PrismaBudgetRepository } from '@/repositories/PrismaBudgetRepository';
import { PrismaServiceRepository } from '@/repositories/PrismaServiceRepository';

const paramsSchema = z.object({
    id: z.string().uuid()
});

export class GetBudgetsController {
    async handle(request: Request, response: Response) {
        try {
            const { id: serviceId } = paramsSchema.parse(request.params);
            const userId = request.user?.id;

            const budgetRepository = new PrismaBudgetRepository();
            const serviceRepository = new PrismaServiceRepository();
            const useCase = new GetBudgetsUseCase(budgetRepository, serviceRepository);

            const budgets = await useCase.execute({
                serviceId,
                userId: userId!
            });

            return response.status(200).json(budgets);
        } catch (error: any) {
            const statusCode = error.message.includes("negado") ? 403 : 400;
            return response.status(statusCode).json({ message: error.message });
        }
    }
}