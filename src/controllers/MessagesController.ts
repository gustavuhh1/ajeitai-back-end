import { Request, Response } from "express";
import { z } from "zod";
import { sendMessageFactory } from "@/usecases/factories/sendMessageFactory";
import { listMessagesFactory } from "@/usecases/factories/listMessagesFactory";

export class MessagesController {
  async send(req: Request, res: Response): Promise<void> {
    const bodySchema = z.object({
      budgetId: z.uuid(),
      text: z.string().optional(),
      imageUrl: z.string().optional(),
    });

    const data = bodySchema.parse(req.body);
    const senderId = req.user!.id;

    const useCase = sendMessageFactory();
    const message = await useCase.execute({
      ...data,
      senderId,
    });

    res.status(201).json(message);
  }

  async list(req: Request, res: Response): Promise<void> {
    /*  #swagger.tags = ['Mensagens']
        #swagger.description = 'Lista todas as mensagens trocadas em um determinado orçamento.'
    */
    const paramsSchema = z.object({ budgetId: z.uuid() });
    const { budgetId } = paramsSchema.parse(req.params);

    const useCase = listMessagesFactory();
    const messages = await useCase.execute(budgetId);

    res.status(200).json(messages);
  }
}