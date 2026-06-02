import { Notification } from "@/entities/Notification";
import { INotificationRepository } from "../INotificationRepository";
import { prisma } from "@/utils/prisma";

export class PrismaNotificationRepository implements INotificationRepository {
  async create(notification: Notification): Promise<void> {
    await prisma.notification.create({
      data: {
        id: notification.id as string,
        userId: notification.userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        isRead: notification.isRead as boolean,
        link: notification.link,
        createdAt: notification.createdAt as Date,
      },
    });
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return notifications.map(
      (n) =>
        new Notification({
          id: n.id,
          userId: n.userId,
          title: n.title,
          message: n.message,
          type: n.type,
          isRead: n.isRead,
          link: n.link,
          createdAt: n.createdAt,
        })
    );
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) return null;

    return new Notification({
      id: notification.id,
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      isRead: notification.isRead,
      link: notification.link,
      createdAt: notification.createdAt,
    });
  }

  async save(notification: Notification): Promise<void> {
    await prisma.notification.update({
      where: { id: notification.id as string },
      data: {
        isRead: notification.isRead as boolean,
      },
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
