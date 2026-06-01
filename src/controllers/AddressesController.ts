import { Request, Response } from "express";
import { z } from "zod";
import { createAddressFactory } from "@/usecases/factories/createAddressFactory";
import { listUserAddressesFactory } from "@/usecases/factories/listUserAddressesFactory";
import { deleteAddressFactory } from "@/usecases/factories/deleteAddressFactory";
import { togglePrincipalAddressFactory } from "@/usecases/factories/togglePrincipalAddressFactory";
import { getAddressByIdFactory } from "@/usecases/factories/getAddressByIdFactory";

export class AddressesController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const createBodySchema = z.object({
        rua: z.string(),
        numero: z.string(),
        ponto_de_referencia: z.string().optional(),
        cep: z.string(),
        complemento: z.string().optional(),
        cidade: z.string(),
        estado: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        principal: z.boolean().optional(),
      });

      const data = createBodySchema.parse(req.body);
      const userId = req.user!.id;

      const useCase = createAddressFactory();
      const address = await useCase.execute({
        ...data,
        user_id: userId,
      });

      res.status(201).json(address);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.issues });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const useCase = listUserAddressesFactory();
      const addresses = await useCase.execute(userId);

      res.status(200).json(addresses);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const getParamsSchema = z.object({
        id: z.uuid(),
      });

      const { id } = getParamsSchema.parse(req.params);
      const userId = req.user!.id;

      const useCase = getAddressByIdFactory();
      const address = await useCase.execute(id, userId);

      res.status(200).json(address);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.issues });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleteParamsSchema = z.object({
        id: z.uuid(),
      });

      const { id } = deleteParamsSchema.parse(req.params);
      const userId = req.user!.id;

      const useCase = deleteAddressFactory();
      await useCase.execute(id, userId);

      res.status(204).send();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.issues });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  async togglePrincipal(req: Request, res: Response): Promise<void> {
    try {
      const toggleParamsSchema = z.object({
        id: z.uuid(),
      });

      const { id } = toggleParamsSchema.parse(req.params);
      const userId = req.user!.id;

      const useCase = togglePrincipalAddressFactory();
      await useCase.execute({ addressId: id, userId });

      res.status(200).send();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.issues });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }
}
