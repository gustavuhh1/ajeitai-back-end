import { Request, Response } from "express";
import { z } from "zod";
import { listNotificationsFactory } from "@/usecases/notifications/factories/notificationFactories";
import { markNotificationAsReadFactory } from "@/usecases/notifications/factories/notificationFactories";
import { markAllNotificationsAsReadFactory } from "@/usecases/notifications/factories/notificationFactories";

export class NotificationsController {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const useCase = listNotificationsFactory();
      const notifications = await useCase.execute({ userId });

      res.status(200).json(notifications);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      
      const markAsReadParamsSchema = z.object({
        id: z.uuid(),
      });

      const { id } = markAsReadParamsSchema.parse(req.params);

      const useCase = markNotificationAsReadFactory();
      await useCase.execute({ notificationId: id, userId });

      res.status(204).send();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.format() });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const useCase = markAllNotificationsAsReadFactory();
      
      await useCase.execute({ userId });

      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
