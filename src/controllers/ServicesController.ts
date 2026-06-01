import { Request, Response } from "express";
import { z } from "zod";
import { createServiceFactory } from "@/usecases/factories/createServiceFactory";
import { listAvailableServicesFactory } from "@/usecases/factories/listAvailableServicesFactory";
import { getServiceDetailsFactory } from "@/usecases/factories/getServiceDetailsFactory";
import { listClientServicesFactory } from "@/usecases/factories/listClientServicesFactory";

export class ServicesController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const createBodySchema = z.object({
        title: z.string(),
        description: z.string(),
        images_url: z.array(z.string()).optional(),
        categoryIds: z.array(z.string()).min(1).max(3),
        address_id: z.uuid(),
      });

      const data = createBodySchema.parse(req.body);

      const clientId = req.user!.id;

      const useCase = createServiceFactory();
      const service = await useCase.execute({
        ...data,
        client_id: clientId,
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

  async listMyServices(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const useCase = listClientServicesFactory();
      const services = await useCase.execute({ userId });

      res.status(200).json(services);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const getRequestParams = z.object({
        id: z.uuid(),
      });

      const updateBodySchema = z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        images_url: z.array(z.string()).optional(),
        address_id: z.uuid().optional(),
      });

      const { id: serviceId } = getRequestParams.parse(req.params);
      const data = updateBodySchema.parse(req.body);
      const userId = req.user!.id;

      const {
        updateServiceFactory,
      } = require("@/usecases/factories/updateServiceFactory");
      const useCase = updateServiceFactory();

      await useCase.execute({
        userId,
        serviceId,
        ...data,
      });

      res.status(200).json({ message: "Serviço atualizado com sucesso" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }
}
