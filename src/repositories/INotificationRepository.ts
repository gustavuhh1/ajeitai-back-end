import { Notification } from "@/entities/Notification";

export interface INotificationRepository {
  create(notification: Notification): Promise<void>;
  findByUserId(userId: string): Promise<Notification[]>;
  findById(id: string): Promise<Notification | null>;
  save(notification: Notification): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
}
