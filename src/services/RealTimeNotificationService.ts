import { INotificationService } from "./INotificationService";
import { INotificationRepository } from "@/repositories/INotificationRepository";
import { Notification } from "@/entities/Notification";
import { emitNotificationToUser } from "@/websockets/socket";

export class RealTimeNotificationService implements INotificationService {
  constructor(private notificationRepository: INotificationRepository) {}

  async dispatch(
    userId: string,
    payload: {
      title: string;
      message: string;
      type: "NEW_QUOTE" | "NEW_MESSAGE" | "STATUS_CHANGE" | "SERVICE_DELETED";
      link?: string | null;
    }
  ): Promise<void> {
    const notification = new Notification({
      userId,
      title: payload.title,
      message: payload.message,
      type: payload.type,
      link: payload.link,
    });

    // Salva no banco de dados
    await this.notificationRepository.create(notification);

    // Emite o evento via Socket.io em tempo real para a sala pessoal do usuário
    emitNotificationToUser(userId, {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      link: notification.link,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    });
  }
}
