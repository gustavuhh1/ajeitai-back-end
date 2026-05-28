import { Request, Response } from "express";
import { z } from "zod";
import { registerClientFactory } from "@/usecases/factories/registerClientFactory";
import { registerProviderFactory } from "@/usecases/factories/registerProviderFactory";

export class UsersController {
  async registerClient(req: Request, res: Response): Promise<void> {
    try {
      const registerBodySchema = z.object({
        name: z.string(),
        email: z.email(),
        password: z.string().optional(),
        phone: z.string().optional(),
        cpf: z.string(),
      });

      const data = registerBodySchema.parse(req.body);

      const useCase = registerClientFactory();
      const user = await useCase.execute(data);

      res.status(201).json(user);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  async registerProvider(req: Request, res: Response): Promise<void> {
    try {
      const registerBodySchema = z.object({
        name: z.string(),
        email: z.email(),
        password: z.string().optional(),
        cpf: z.string(),
        image: z.string().optional(),
        phone: z.string().optional(),
        birthDate: z.coerce.date(),
        description: z.string().min(100),
      });

      const data = registerBodySchema.parse(req.body);

      const useCase = registerProviderFactory();
      const user = await useCase.execute(data);

      res.status(201).json(user);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }
}

