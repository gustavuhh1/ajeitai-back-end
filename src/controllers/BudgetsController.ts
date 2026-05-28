import { Request, Response } from 'express';
import { z } from 'zod';
import { createBudgetFactory } from '@/usecases/factories/createBudgetFactory';
import { counterProposalFactory } from '@/usecases/factories/counterProposalFactory';
import { acceptBudgetFactory } from '@/usecases/factories/acceptBudgetFactory';
import { listServiceBudgetsFactory } from '@/usecases/factories/listServiceBudgetsFactory';

export class BudgetsController {
  async create(req: Request, res: Response): Promise<void> {
    const createBodySchema = z.object({
      serviceId: z.uuid(),
      price: z.number().positive(),
      description: z.string(),
      estimatedDate: z.coerce.date(),
    });

    const data = createBodySchema.parse(req.body);
    const providerId = req.user!.id;

    const useCase = createBudgetFactory();
    const budget = await useCase.execute({
      ...data,
      providerId
    });

    res.status(201).json(budget);
  }

  async counterProposal(req: Request, res: Response): Promise<void> {
    const paramsSchema = z.object({ id: z.uuid() });
    const bodySchema = z.object({
      newPrice: z.number().positive(),
      newDate: z.coerce.date(),
      newDescription: z.string(),
      isFromClient: z.boolean(),
    });

    const { id } = paramsSchema.parse(req.params);
    const data = bodySchema.parse(req.body);

    const useCase = counterProposalFactory();
    const budget = await useCase.execute({
      budgetId: id,
      ...data
    });

    res.status(200).json(budget);
  }

  async accept(req: Request, res: Response): Promise<void> {
    const paramsSchema = z.object({ id: z.uuid() });
    const bodySchema = z.object({ serviceId: z.uuid() });

    const { id } = paramsSchema.parse(req.params);
    const { serviceId } = bodySchema.parse(req.body);

    const useCase = acceptBudgetFactory();
    const budget = await useCase.execute({ budgetId: id, serviceId });

    res.status(200).json(budget);
  }

  async listServiceBudgets(req: Request, res: Response): Promise<void> {
    const paramsSchema = z.object({ serviceId: z.uuid() });
    const { serviceId } = paramsSchema.parse(req.params);

    const useCase = listServiceBudgetsFactory();
    const budgets = await useCase.execute(serviceId);

    res.status(200).json(budgets);
  }
}