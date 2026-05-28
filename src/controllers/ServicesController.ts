import { Request, Response } from 'express';
import { z } from 'zod';
import { createServiceFactory } from '@/usecases/factories/createServiceFactory';
import { listAvailableServicesFactory } from '@/usecases/factories/listAvailableServicesFactory';
import { getServiceDetailsFactory } from '@/usecases/factories/getServiceDetailsFactory';

export class ServicesController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const createBodySchema = z.object({
        title: z.string(),
        description: z.string(),
        images_url: z.array(z.string()).optional(),
        categoryIds: z.array(z.string()).min(1).max(3),
        city: z.string(),
        neighborhood: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      });

      const data = createBodySchema.parse(req.body);
      
      // Usando o id do usuário logado (simulado até a Fase 6)
      // TODO: alterar isso para buscar o id do usuário logado
      const clientId = (req as any).user?.id || "mock-client-id";

      const useCase = createServiceFactory();
      const service = await useCase.execute({
        ...data,
        client_id: clientId
      });

      res.status(201).json(service);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  async listAvailable(req: Request, res: Response): Promise<void> {
    try {
      const listQuerySchema = z.object({
        categoryId: z.string().optional(),
        city: z.string().optional(),
        page: z.coerce.number().default(1),
        limit: z.coerce.number().default(10),
      });

      const filters = listQuerySchema.parse(req.query);

      const useCase = listAvailableServicesFactory();
      const services = await useCase.execute(filters);

      res.status(200).json(services);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.format() });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  async getDetails(req: Request, res: Response): Promise<void> {
    try {
      const getRequestParams = z.object({
        id: z.uuid(),
      });

      const { id: serviceId } = getRequestParams.parse(req.params);

      const useCase = getServiceDetailsFactory();
      const service = await useCase.execute({ serviceId });

      res.status(200).json(service);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }
}

