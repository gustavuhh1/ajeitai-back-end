import { INotificationRepository } from "@/repositories/INotificationRepository";

interface MarkNotificationAsReadRequest {
  notificationId: string;
  userId: string;
}

export class MarkNotificationAsReadUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute({ notificationId, userId }: MarkNotificationAsReadRequest): Promise<void> {
    const notification = await this.notificationRepository.findById(notificationId);

    if (!notification) {
      throw new Error("Notificação não encontrada");
    }

    if (notification.userId !== userId) {
      throw new Error("Não autorizado");
    }

    notification.markAsRead();
    await this.notificationRepository.save(notification);
  }
}
