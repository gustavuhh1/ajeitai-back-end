import { INotificationRepository } from "@/repositories/INotificationRepository";

interface MarkAllNotificationsAsReadRequest {
  userId: string;
}

export class MarkAllNotificationsAsReadUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute({ userId }: MarkAllNotificationsAsReadRequest): Promise<void> {
    await this.notificationRepository.markAllAsRead(userId);
  }
}
