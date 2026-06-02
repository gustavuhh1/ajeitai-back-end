import { Notification } from "@/entities/Notification";
import { INotificationRepository } from "../INotificationRepository";

export class InMemoryNotificationRepository implements INotificationRepository {
  public items: Notification[] = [];

  async create(notification: Notification): Promise<void> {
    this.items.push(notification);
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    return this.items
      .filter((n) => n.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = this.items.find((n) => n.id === id);
    return notification || null;
  }

  async save(notification: Notification): Promise<void> {
    const index = this.items.findIndex((n) => n.id === notification.id);
    if (index >= 0) {
      this.items[index] = notification;
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    this.items.forEach((n) => {
      if (n.userId === userId && !n.isRead) {
        n.markAsRead();
      }
    });
  }
}
