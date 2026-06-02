import { INotificationRepository } from "@/repositories/INotificationRepository";
import { Notification } from "@/entities/Notification";

interface ListNotificationsRequest {
  userId: string;
}

export class ListNotificationsUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute({ userId }: ListNotificationsRequest): Promise<Notification[]> {
    const notifications = await this.notificationRepository.findByUserId(userId);
    return notifications;
  }
}
