import { Request, Response } from "express";
import { z } from "zod";
import { createBudgetFactory } from "@/usecases/factories/createBudgetFactory";
import { counterProposalFactory } from "@/usecases/factories/counterProposalFactory";
import { acceptBudgetFactory } from "@/usecases/factories/acceptBudgetFactory";
import { listServiceBudgetsFactory } from "@/usecases/factories/listServiceBudgetsFactory";

export class BudgetsController {
  async create(req: Request, res: Response): Promise<void> {
    try {
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
        providerId,
      });

      res.status(201).json(budget);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.format() });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  async counterProposal(req: Request, res: Response): Promise<void> {
    try {
      const paramsSchema = z.object({ id: z.uuid() });
      const bodySchema = z.object({
        price: z.number().positive(),
        estimatedDate: z.coerce.date(),
        description: z.string(),
      });

      const { id } = paramsSchema.parse(req.params);
      const data = bodySchema.parse(req.body);
      const isFromClient = req.user!.role === "CLIENT";
      const userId = req.user!.id;

      const useCase = counterProposalFactory();
      const budget = await useCase.execute({
        budgetId: id,
        userId,
        isFromClient,
        newPrice: data.price,
        newDate: data.estimatedDate,
        newDescription: data.description,
      });

      res.status(200).json(budget);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  async accept(req: Request, res: Response): Promise<void> {
    try {
      const paramsSchema = z.object({ id: z.uuid() });

      const { id } = paramsSchema.parse(req.params);
      const isFromClient = req.user!.role === "CLIENT";
      const userId = req.user!.id;

      const useCase = acceptBudgetFactory();
      const budget = await useCase.execute({ budgetId: id, userId, isFromClient });

      res.status(200).json(budget);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  async listServiceBudgets(req: Request, res: Response): Promise<void> {
    try {
      const paramsSchema = z.object({ serviceId: z.uuid() });
      const { serviceId } = paramsSchema.parse(req.params);

      const useCase = listServiceBudgetsFactory();
      const budgets = await useCase.execute(serviceId);

      res.status(200).json(budgets);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.format() });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }
}
