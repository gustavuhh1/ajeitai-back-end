import { Request, Response } from "express";
import { z } from "zod";
import { registerClientFactory } from "@/usecases/factories/registerClientFactory";
import { registerProviderFactory } from "@/usecases/factories/registerProviderFactory";

export class UsersController {
  async registerClient(req: Request, res: Response): Promise<void> {
    const registerBodySchema = z.object({
      name: z.string(),
      email: z.email(),
      image: z.string().optional(),
      password: z.string().optional(),
      phone: z.string().optional(),
      cpf: z.string(),
    });

    const data = registerBodySchema.parse(req.body);

    const useCase = registerClientFactory();
    const user = await useCase.execute(data);

    res.status(201).json(user);
  }

  async registerProvider(req: Request, res: Response): Promise<void> {
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
  }
}