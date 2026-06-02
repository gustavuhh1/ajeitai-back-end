import { PrismaNotificationRepository } from "@/repositories/prisma/PrismaNotificationRepository";
import { ListNotificationsUseCase } from "../ListNotificationsUseCase";
import { MarkNotificationAsReadUseCase } from "../MarkNotificationAsReadUseCase";
import { MarkAllNotificationsAsReadUseCase } from "../MarkAllNotificationsAsReadUseCase";

export function listNotificationsFactory() {
  const repository = new PrismaNotificationRepository();
  return new ListNotificationsUseCase(repository);
}

export function markNotificationAsReadFactory() {
  const repository = new PrismaNotificationRepository();
  return new MarkNotificationAsReadUseCase(repository);
}

export function markAllNotificationsAsReadFactory() {
  const repository = new PrismaNotificationRepository();
  return new MarkAllNotificationsAsReadUseCase(repository);
}
